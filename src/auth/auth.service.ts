import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OAuth2Client } from 'google-auth-library';
import appleSignin from 'apple-signin-auth';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {
    // Initialize Google OAuth client
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (googleClientId) {
      this.googleClient = new OAuth2Client(googleClientId);
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, role, businessName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction: Create Business AND User
    const result = await this.prisma.$transaction(async (prisma) => {
      // 1. Create Business
      const business = await prisma.business.create({
        data: {
          name: businessName,
        },
      });

      // 2. Create User linked to Business
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          businessId: business.id,
        },
      });

      return { user, business };
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = result.user;

    return {
      user: userWithoutPassword,
      business: result.business,
      message: 'User and Business registered successfully',
    };
  }

  async login(loginDto: LoginDto, deviceId?: string) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has a password (not OAuth-only user)
    if (!user.password) {
      throw new UnauthorizedException(
        'This account uses OAuth sign-in. Please use Google or Apple to sign in.',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // Update user with new session info (invalidates previous session)
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        currentDeviceId: deviceId || null,
        currentSessionToken: sessionToken,
        lastLoginAt: new Date(),
      },
    });

    // Generate JWT token with session info
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
      sessionToken, // Include session token in JWT
    };
    const accessToken = await this.jwtService.signAsync(payload);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      accessToken,
      user: userWithoutPassword,
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validateSession(userId: string, sessionToken: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { currentSessionToken: true },
    });

    if (!user) {
      return false;
    }

    // Check if session token matches
    return user.currentSessionToken === sessionToken;
  }

  // ============ OAuth Sign-In Methods ============

  async signInWithGoogle(idToken: string) {
    if (!this.googleClient) {
      throw new BadRequestException('Google OAuth is not configured');
    }

    try {
      // Verify Google ID token
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const { email, name, sub: googleId } = payload;

      // Find user - must be registered by admin first
      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException(
          'No account found with this email. Please contact your administrator to create an account first.',
        );
      }

      // Update OAuth info for existing user
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          oauthProvider: 'GOOGLE',
          oauthProviderId: googleId,
          isEmailVerified: true, // Google emails are pre-verified
        },
      });

      // Generate session token and JWT
      const sessionToken = crypto.randomBytes(32).toString('hex');
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          currentSessionToken: sessionToken,
          lastLoginAt: new Date(),
        },
      });

      const jwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        businessId: user.businessId,
        sessionToken,
      };
      const accessToken = await this.jwtService.signAsync(jwtPayload);

      const { password: _, ...userWithoutPassword } = user;
      return { accessToken, user: userWithoutPassword };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async signInWithApple(idToken: string) {
    try {
      // Verify Apple ID token
      const appleClientId = this.configService.get<string>('APPLE_CLIENT_ID');
      
      const appleIdTokenPayload = await appleSignin.verifyIdToken(idToken, {
        audience: appleClientId,
        ignoreExpiration: false,
      });

      if (!appleIdTokenPayload || !appleIdTokenPayload.email) {
        throw new UnauthorizedException('Invalid Apple token');
      }

      const { email, sub: appleId } = appleIdTokenPayload;
      const name = appleIdTokenPayload.email?.split('@')[0] || 'Apple User';

      // Find user - must be registered by admin first
      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException(
          'No account found with this email. Please contact your administrator to create an account first.',
        );
      }

      // Update OAuth info for existing user
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          oauthProvider: 'APPLE',
          oauthProviderId: appleId,
          isEmailVerified: true, // Apple emails are pre-verified
        },
      });

      // Generate session token and JWT
      const sessionToken = crypto.randomBytes(32).toString('hex');
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          currentSessionToken: sessionToken,
          lastLoginAt: new Date(),
        },
      });

      const jwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        businessId: user.businessId,
        sessionToken,
      };
      const accessToken = await this.jwtService.signAsync(jwtPayload);

      const { password: _, ...userWithoutPassword } = user;
      return { accessToken, user: userWithoutPassword };
    } catch (error) {
      throw new UnauthorizedException('Invalid Apple token');
    }
  }

  // ============ Email Verification Methods ============

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Mark email as verified and clear token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return {
      message: 'Email verified successfully',
      email: user.email,
    };
  }

  // ============ Password Reset Methods ============

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return {
        message: 'If the email exists, a password reset link has been sent',
      };
    }

    // Check if user has a password (not OAuth-only user)
    if (!user.password) {
      throw new BadRequestException(
        'This account uses OAuth sign-in. Please use Google or Apple to sign in.',
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to database
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // Send reset email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      message: 'If the email exists, a password reset link has been sent',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return {
      message: 'Password reset successfully',
    };
  }
}

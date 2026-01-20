import { Controller, Post, Body, Get, UseGuards, Headers, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OAuthSignInDto } from './dto/oauth-signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User, type RequestUser } from '../common/decorators/user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Register new user (Admin only)',
    description: 'Create a new user account. Only accessible by Admin users.',
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user and receive JWT access token',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      admin: {
        summary: 'Admin Login',
        value: {
          email: 'admin@pos.com',
          password: 'admin123',
        },
      },
      kasir: {
        summary: 'Kasir Login',
        value: {
          email: 'kasir@pos.com',
          password: 'kasir123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful - Returns access token and user data',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 'user-id',
          email: 'admin@pos.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Headers('x-device-id') deviceId?: string,
  ) {
    return this.authService.login(loginDto, deviceId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user profile',
    description: "Retrieve the authenticated user's profile information with business details",
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        user: {
          id: 'user-id',
          email: 'kasir@kedaikita.com',
          name: 'Kasir User',
          role: 'KASIR',
          businessId: 'business-id',
          business: {
            id: 'business-id',
            name: 'Kedai Kita',
            address: 'Jl. Contoh No. 123',
            phone: '081234567890',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getProfile(@User() user: RequestUser) {
    return { user };
  }

  // ============ OAuth Sign-In Endpoints ============

  @Post('apple')
  @ApiOperation({
    summary: 'Sign in with Apple',
    description: 'Authenticate user using Apple ID token',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful - Returns access token and user data',
  })
  @ApiResponse({ status: 401, description: 'Invalid Apple token' })
  async signInWithApple(@Body() oauthDto: OAuthSignInDto) {
    return this.authService.signInWithApple(oauthDto.idToken);
  }

  @Post('google')
  @ApiOperation({
    summary: 'Sign in with Google',
    description: 'Authenticate user using Google ID token',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful - Returns access token and user data',
  })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  async signInWithGoogle(@Body() oauthDto: OAuthSignInDto) {
    return this.authService.signInWithGoogle(oauthDto.idToken);
  }

  // ============ Email Verification ============

  @Get('verify')
  @ApiOperation({
    summary: 'Verify email address',
    description: 'Verify user email using token from verification email',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired verification token',
  })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // ============ Password Reset ============

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send password reset email to user',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent (if email exists)',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset user password using token from reset email',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired reset token',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}

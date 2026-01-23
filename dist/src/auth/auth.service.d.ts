import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private emailService;
    private configService;
    private googleClient;
    constructor(prisma: PrismaService, jwtService: JwtService, emailService: EmailService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            currentDeviceId: string | null;
            currentSessionToken: string | null;
            lastLoginAt: Date | null;
            isEmailVerified: boolean;
            emailVerificationToken: string | null;
            emailVerificationExpires: Date | null;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            oauthProvider: string | null;
            oauthProviderId: string | null;
        };
        business: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            phone: string | null;
        };
        message: string;
    }>;
    login(loginDto: LoginDto, deviceId?: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            currentDeviceId: string | null;
            currentSessionToken: string | null;
            lastLoginAt: Date | null;
            isEmailVerified: boolean;
            emailVerificationToken: string | null;
            emailVerificationExpires: Date | null;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            oauthProvider: string | null;
            oauthProviderId: string | null;
        };
    }>;
    validateUser(userId: string): Promise<{
        business: {
            id: string;
            name: string;
            address: string | null;
            phone: string | null;
        };
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        currentDeviceId: string | null;
        currentSessionToken: string | null;
        lastLoginAt: Date | null;
        isEmailVerified: boolean;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
        passwordResetToken: string | null;
        passwordResetExpires: Date | null;
        oauthProvider: string | null;
        oauthProviderId: string | null;
    } | null>;
    validateSession(userId: string, sessionToken: string): Promise<boolean>;
    signInWithGoogle(idToken: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            currentDeviceId: string | null;
            currentSessionToken: string | null;
            lastLoginAt: Date | null;
            isEmailVerified: boolean;
            emailVerificationToken: string | null;
            emailVerificationExpires: Date | null;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            oauthProvider: string | null;
            oauthProviderId: string | null;
        };
    }>;
    signInWithApple(idToken: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            currentDeviceId: string | null;
            currentSessionToken: string | null;
            lastLoginAt: Date | null;
            isEmailVerified: boolean;
            emailVerificationToken: string | null;
            emailVerificationExpires: Date | null;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            oauthProvider: string | null;
            oauthProviderId: string | null;
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
        email: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}

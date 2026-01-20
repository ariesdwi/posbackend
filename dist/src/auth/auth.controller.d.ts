import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OAuthSignInDto } from './dto/oauth-signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { type RequestUser } from '../common/decorators/user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
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
            name: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
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
    getProfile(user: RequestUser): Promise<{
        user: RequestUser;
    }>;
    signInWithApple(oauthDto: OAuthSignInDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
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
    signInWithGoogle(oauthDto: OAuthSignInDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
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
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}

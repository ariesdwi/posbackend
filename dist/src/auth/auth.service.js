"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("./email.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const google_auth_library_1 = require("google-auth-library");
const apple_signin_auth_1 = __importDefault(require("apple-signin-auth"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    emailService;
    configService;
    googleClient;
    constructor(prisma, jwtService, emailService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.configService = configService;
        const googleClientId = this.configService.get('GOOGLE_CLIENT_ID');
        if (googleClientId) {
            this.googleClient = new google_auth_library_1.OAuth2Client(googleClientId);
        }
    }
    async register(registerDto) {
        const { email, password, name, role, businessName } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.UnauthorizedException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await this.prisma.$transaction(async (prisma) => {
            const business = await prisma.business.create({
                data: {
                    name: businessName,
                },
            });
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
        const { password: _, ...userWithoutPassword } = result.user;
        return {
            user: userWithoutPassword,
            business: result.business,
            message: 'User and Business registered successfully',
        };
    }
    async login(loginDto, deviceId) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('This account uses OAuth sign-in. Please use Google or Apple to sign in.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const sessionToken = crypto.randomBytes(32).toString('hex');
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                currentDeviceId: deviceId || null,
                currentSessionToken: sessionToken,
                lastLoginAt: new Date(),
            },
        });
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            businessId: user.businessId,
            sessionToken,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        const { password: _, ...userWithoutPassword } = user;
        return {
            accessToken,
            user: userWithoutPassword,
        };
    }
    async validateUser(userId) {
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
    async validateSession(userId, sessionToken) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { currentSessionToken: true },
        });
        if (!user) {
            return false;
        }
        return user.currentSessionToken === sessionToken;
    }
    async signInWithGoogle(idToken) {
        if (!this.googleClient) {
            throw new common_1.BadRequestException('Google OAuth is not configured');
        }
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: this.configService.get('GOOGLE_CLIENT_ID'),
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new common_1.UnauthorizedException('Invalid Google token');
            }
            const { email, name, sub: googleId } = payload;
            let user = await this.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new common_1.BadRequestException('No account found with this email. Please contact your administrator to create an account first.');
            }
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    oauthProvider: 'GOOGLE',
                    oauthProviderId: googleId,
                    isEmailVerified: true,
                },
            });
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
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid Google token');
        }
    }
    async signInWithApple(idToken) {
        try {
            const appleClientId = this.configService.get('APPLE_CLIENT_ID');
            const appleIdTokenPayload = await apple_signin_auth_1.default.verifyIdToken(idToken, {
                audience: appleClientId,
                ignoreExpiration: false,
            });
            if (!appleIdTokenPayload || !appleIdTokenPayload.email) {
                throw new common_1.UnauthorizedException('Invalid Apple token');
            }
            const { email, sub: appleId } = appleIdTokenPayload;
            const name = appleIdTokenPayload.email?.split('@')[0] || 'Apple User';
            let user = await this.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new common_1.BadRequestException('No account found with this email. Please contact your administrator to create an account first.');
            }
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    oauthProvider: 'APPLE',
                    oauthProviderId: appleId,
                    isEmailVerified: true,
                },
            });
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
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid Apple token');
        }
    }
    async verifyEmail(token) {
        const user = await this.prisma.user.findFirst({
            where: {
                emailVerificationToken: token,
                emailVerificationExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
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
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return {
                message: 'If the email exists, a password reset link has been sent',
            };
        }
        if (!user.password) {
            throw new common_1.BadRequestException('This account uses OAuth sign-in. Please use Google or Apple to sign in.');
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: resetToken,
                passwordResetExpires: resetExpires,
            },
        });
        await this.emailService.sendPasswordResetEmail(email, resetToken);
        return {
            message: 'If the email exists, a password reset link has been sent',
        };
    }
    async resetPassword(token, newPassword) {
        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
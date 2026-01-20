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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = class EmailService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        const port = this.configService.get('MAIL_PORT', 587);
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST', 'smtp.gmail.com'),
            port: port,
            secure: port === 465,
            requireTLS: port === 587,
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    async sendVerificationEmail(email, token) {
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3001');
        const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;
        if (this.configService.get('NODE_ENV') === 'development') {
            console.log('\n📧 [EMAIL] Verification Email');
            console.log('To:', email);
            console.log('Verification URL:', verificationUrl);
            console.log('Token:', token);
            console.log('---\n');
            return;
        }
        const mailOptions = {
            from: this.configService.get('MAIL_FROM', 'noreply@pos.com'),
            to: email,
            subject: 'Verify Your Email - POS System',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link in your browser:<br>
            <a href="${verificationUrl}">${verificationUrl}</a>
          </p>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 24 hours.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendPasswordResetEmail(email, token) {
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3001');
        const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
        if (this.configService.get('NODE_ENV') === 'development') {
            console.log('\n📧 [EMAIL] Password Reset Email');
            console.log('To:', email);
            console.log('Reset URL:', resetUrl);
            console.log('Token:', token);
            console.log('---\n');
            return;
        }
        const mailOptions = {
            from: this.configService.get('MAIL_FROM', 'noreply@pos.com'),
            to: email,
            subject: 'Password Reset Request - POS System',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link in your browser:<br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>
      `,
        };
        await this.transporter.sendMail(mailOptions);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map
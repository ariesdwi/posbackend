import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    businessId: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        name: string;
        businessId: string;
        business: {
            id: string;
            name: string;
            address: string | null;
            phone: string | null;
        };
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
}
export {};

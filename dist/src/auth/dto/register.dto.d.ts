import { UserRole } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    businessName: string;
    role: UserRole;
}

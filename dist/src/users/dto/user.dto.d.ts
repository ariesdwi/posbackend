import { UserRole } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    role: UserRole;
}
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    name?: string;
    role?: UserRole;
    isActive?: boolean;
}

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto, businessId: string): Promise<{
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
    }>;
    findAll(businessId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }[]>;
    findOne(id: string, businessId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, businessId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    remove(id: string, businessId: string): Promise<{
        message: string;
    }>;
    findAllGlobal(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        business: {
            id: string;
            name: string;
            phone: string | null;
        };
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }[]>;
    findAllByRole(role: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        business: {
            id: string;
            name: string;
            phone: string | null;
        };
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }[]>;
    findOneGlobal(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        business: {
            id: string;
            name: string;
            address: string | null;
            phone: string | null;
        };
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    updateGlobal(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    removeGlobal(id: string): Promise<{
        message: string;
    }>;
}

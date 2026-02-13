import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import type { RequestUser } from '../common/decorators/user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAllGlobal(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        business: {
            id: string;
            name: string;
            phone: string | null;
        };
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        businessId: string;
    }[]>;
    findByRole(role: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        business: {
            id: string;
            name: string;
            phone: string | null;
        };
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        businessId: string;
    }[]>;
    findOneGlobal(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        business: {
            id: string;
            name: string;
            address: string | null;
            phone: string | null;
        };
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        businessId: string;
    }>;
    updateGlobal(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        businessId: string;
    }>;
    removeGlobal(id: string): Promise<{
        message: string;
    }>;
    create(createUserDto: CreateUserDto, user: RequestUser): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        businessId: string;
        currentDeviceId: string | null;
        currentSessionToken: string | null;
        lastLoginAt: Date | null;
        emailVerificationExpires: Date | null;
        emailVerificationToken: string | null;
        isEmailVerified: boolean;
        oauthProvider: string | null;
        oauthProviderId: string | null;
        passwordResetExpires: Date | null;
        passwordResetToken: string | null;
    }>;
    findAll(user: RequestUser): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }[]>;
    findOne(id: string, user: RequestUser): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, user: RequestUser): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    remove(id: string, user: RequestUser): Promise<{
        message: string;
    }>;
}

import { MenuService } from './menu.service';
import { CreateProductDto, UpdateProductDto, UpdateStockDto } from './dto/product.dto';
import type { RequestUser } from '../common/decorators/user.decorator';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    create(createProductDto: CreateProductDto, user: RequestUser, file?: Express.Multer.File): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    findAll(user: RequestUser, categoryId?: string, search?: string): Promise<({
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    })[]>;
    findOne(id: string, user: RequestUser): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, user: RequestUser, file?: Express.Multer.File): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    updateStock(id: string, updateStockDto: UpdateStockDto, user: RequestUser): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    remove(id: string, user: RequestUser): Promise<{
        message: string;
    }>;
}

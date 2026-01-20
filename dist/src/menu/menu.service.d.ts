import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, UpdateStockDto } from './dto/product.dto';
import { UploadService } from '../upload/upload.service';
export declare class MenuService {
    private prisma;
    private uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(createProductDto: CreateProductDto, businessId: string, file?: Express.Multer.File): Promise<{
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
        costPrice: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    findAll(businessId: string, categoryId?: string, search?: string): Promise<({
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
        costPrice: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    })[]>;
    findOne(id: string, businessId: string): Promise<{
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
        costPrice: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, businessId: string, file?: Express.Multer.File): Promise<{
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
        costPrice: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    updateStock(id: string, updateStockDto: UpdateStockDto, businessId: string): Promise<{
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
        costPrice: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    remove(id: string, businessId: string): Promise<{
        message: string;
    }>;
}

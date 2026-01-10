import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, UpdateStockDto } from './dto/product.dto';
import { UploadService } from '../upload/upload.service';
export declare class MenuService {
    private prisma;
    private uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
    }>;
    findAll(categoryId?: string, search?: string): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
    }>;
    updateStock(id: string, updateStockDto: UpdateStockDto): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

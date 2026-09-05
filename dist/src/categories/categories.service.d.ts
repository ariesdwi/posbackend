import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto, businessId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
    }>;
    findAll(businessId: string): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
    })[]>;
    findOne(id: string, businessId: string): Promise<{
        products: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            businessId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            imageUrl: string | null;
            status: import("@prisma/client").$Enums.ProductStatus;
            categoryId: string;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto, businessId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
    }>;
    remove(id: string, businessId: string): Promise<{
        message: string;
    }>;
}

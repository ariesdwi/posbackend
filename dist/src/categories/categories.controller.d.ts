import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import type { RequestUser } from '../common/decorators/user.decorator';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto, user: RequestUser): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        description: string | null;
    }>;
    findAll(user: RequestUser): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        description: string | null;
    })[]>;
    findOne(id: string, user: RequestUser): Promise<{
        products: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            imageUrl: string | null;
            status: import("@prisma/client").$Enums.ProductStatus;
            categoryId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        description: string | null;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto, user: RequestUser): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        description: string | null;
    }>;
    remove(id: string, user: RequestUser): Promise<{
        message: string;
    }>;
}

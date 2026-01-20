import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import type { RequestUser } from '../common/decorators/user.decorator';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto, user: RequestUser): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    findAll(user: RequestUser): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    })[]>;
    findOne(id: string, user: RequestUser): Promise<{
        products: {
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
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto, user: RequestUser): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    remove(id: string, user: RequestUser): Promise<{
        message: string;
    }>;
}

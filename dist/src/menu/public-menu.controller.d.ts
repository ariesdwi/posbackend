import { MenuService } from './menu.service';
import { CategoriesService } from '../categories/categories.service';
import { BusinessesService } from '../businesses/businesses.service';
export declare class PublicMenuController {
    private readonly menuService;
    private readonly categoriesService;
    private readonly businessesService;
    constructor(menuService: MenuService, categoriesService: CategoriesService, businessesService: BusinessesService);
    getBusinessInfo(businessId: string): Promise<{
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
    }>;
    findAllCategories(businessId: string): Promise<({
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
    findAllProducts(businessId: string, categoryId?: string, search?: string): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            description: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        imageUrl: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        categoryId: string;
        costPrice: import("@prisma/client-runtime-utils").Decimal;
    })[]>;
}

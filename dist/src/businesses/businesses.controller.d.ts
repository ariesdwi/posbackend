import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
export declare class BusinessesController {
    private readonly businessesService;
    constructor(businessesService: BusinessesService);
    create(createBusinessDto: CreateBusinessDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
    }>;
    findAll(): Promise<({
        _count: {
            users: number;
            categories: number;
            products: number;
            transactions: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            categories: number;
            products: number;
            transactions: number;
        };
        users: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
    }>;
    getStats(id: string): Promise<{
        business: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            phone: string | null;
        };
        stats: {
            users: number;
            products: number;
            categories: number;
            transactions: number;
            totalRevenue: number;
        };
    }>;
    update(id: string, updateBusinessDto: UpdateBusinessDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
}

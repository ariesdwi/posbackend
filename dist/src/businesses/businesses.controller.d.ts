import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
export declare class BusinessesController {
    private readonly businessesService;
    constructor(businessesService: BusinessesService);
    create(createBusinessDto: CreateBusinessDto): Promise<{
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        _count: {
            categories: number;
            products: number;
            transactions: number;
            users: number;
        };
    } & {
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        users: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
        _count: {
            categories: number;
            products: number;
            transactions: number;
        };
    } & {
        id: string;
        name: string;
        address: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getStats(id: string): Promise<{
        business: {
            id: string;
            name: string;
            address: string | null;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        address: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
}

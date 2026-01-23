import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
export declare class BusinessesService {
    private prisma;
    constructor(prisma: PrismaService);
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
            transactions: number;
            users: number;
            categories: number;
            products: number;
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
        users: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
        _count: {
            transactions: number;
            categories: number;
            products: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
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
}

import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionStatusDto } from './dto/transaction.dto';
import { Prisma } from '@prisma/client';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTransactionDto: CreateTransactionDto, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            };
        } & {
            id: string;
            price: Prisma.Decimal;
            productId: string;
            quantity: number;
            productName: string;
            subtotal: Prisma.Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentAmount: Prisma.Decimal | null;
        notes: string | null;
        transactionNumber: string;
        totalAmount: Prisma.Decimal;
        changeAmount: Prisma.Decimal | null;
        userId: string;
    }>;
    findAll(startDate?: string, endDate?: string, status?: string, userId?: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            };
        } & {
            id: string;
            price: Prisma.Decimal;
            productId: string;
            quantity: number;
            productName: string;
            subtotal: Prisma.Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentAmount: Prisma.Decimal | null;
        notes: string | null;
        transactionNumber: string;
        totalAmount: Prisma.Decimal;
        changeAmount: Prisma.Decimal | null;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            };
        } & {
            id: string;
            price: Prisma.Decimal;
            productId: string;
            quantity: number;
            productName: string;
            subtotal: Prisma.Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentAmount: Prisma.Decimal | null;
        notes: string | null;
        transactionNumber: string;
        totalAmount: Prisma.Decimal;
        changeAmount: Prisma.Decimal | null;
        userId: string;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateTransactionStatusDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            };
        } & {
            id: string;
            price: Prisma.Decimal;
            productId: string;
            quantity: number;
            productName: string;
            subtotal: Prisma.Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentAmount: Prisma.Decimal | null;
        notes: string | null;
        transactionNumber: string;
        totalAmount: Prisma.Decimal;
        changeAmount: Prisma.Decimal | null;
        userId: string;
    }>;
}

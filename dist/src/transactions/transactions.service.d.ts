import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionStatusDto, CheckoutDto } from './dto/transaction.dto';
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
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
            productId: string;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
        userId: string;
    }>;
    checkout(id: string, checkoutDto: CheckoutDto): Promise<{
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
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
            productId: string;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
        userId: string;
    }>;
    findAll(startDate?: string, endDate?: string, status?: string, userId?: string, tableNumber?: string): Promise<({
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
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
            productId: string;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
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
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
            productId: string;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
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
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
            productId: string;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
        userId: string;
    }>;
}

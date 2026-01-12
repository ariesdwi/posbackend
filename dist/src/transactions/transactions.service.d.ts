import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionStatusDto, CheckoutDto, UpdateTransactionDto } from './dto/transaction.dto';
import { Prisma } from '@prisma/client';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTransactionDto: CreateTransactionDto, userId: string, businessId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: Prisma.Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        tableNumber: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        changeAmount: Prisma.Decimal | null;
    }>;
    checkout(id: string, checkoutDto: CheckoutDto, businessId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: Prisma.Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        tableNumber: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        changeAmount: Prisma.Decimal | null;
    }>;
    findAll(businessId: string, startDate?: string, endDate?: string, status?: string, userId?: string, tableNumber?: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: Prisma.Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        tableNumber: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        changeAmount: Prisma.Decimal | null;
    })[]>;
    findOne(id: string, businessId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: Prisma.Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        tableNumber: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        changeAmount: Prisma.Decimal | null;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateTransactionStatusDto, businessId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: Prisma.Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        tableNumber: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        changeAmount: Prisma.Decimal | null;
    }>;
    update(id: string, updateDto: UpdateTransactionDto, businessId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: Prisma.Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        tableNumber: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        changeAmount: Prisma.Decimal | null;
    }>;
}

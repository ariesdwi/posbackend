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
                costPrice: Prisma.Decimal;
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
            costPrice: Prisma.Decimal;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
        userId: string;
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
                costPrice: Prisma.Decimal;
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
            costPrice: Prisma.Decimal;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
        userId: string;
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
                costPrice: Prisma.Decimal;
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
            costPrice: Prisma.Decimal;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
        userId: string;
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
                costPrice: Prisma.Decimal;
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
            costPrice: Prisma.Decimal;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
        userId: string;
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
                costPrice: Prisma.Decimal;
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
            costPrice: Prisma.Decimal;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
        userId: string;
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
                costPrice: Prisma.Decimal;
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
            costPrice: Prisma.Decimal;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
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

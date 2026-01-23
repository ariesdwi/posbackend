import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionStatusDto, CheckoutDto, UpdateTransactionDto } from './dto/transaction.dto';
import { Prisma } from '@prisma/client';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTransactionDto: CreateTransactionDto, userId: string, businessId: string): Promise<{
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
                businessId: string;
                description: string | null;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
    }>;
    checkout(id: string, checkoutDto: CheckoutDto, businessId: string): Promise<{
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
                businessId: string;
                description: string | null;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
    }>;
    findAll(businessId: string, startDate?: string, endDate?: string, status?: string, userId?: string, tableNumber?: string): Promise<({
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
                businessId: string;
                description: string | null;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
    })[]>;
    findOne(id: string, businessId: string): Promise<{
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
                businessId: string;
                description: string | null;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateTransactionStatusDto, businessId: string): Promise<{
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
                businessId: string;
                description: string | null;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
    }>;
    update(id: string, updateDto: UpdateTransactionDto, businessId: string): Promise<{
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
                businessId: string;
                description: string | null;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        notes: string | null;
    }>;
    delete(id: string, businessId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

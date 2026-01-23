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
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                name: string;
                description: string | null;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
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
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                name: string;
                description: string | null;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
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
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                name: string;
                description: string | null;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
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
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                name: string;
                description: string | null;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
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
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                name: string;
                description: string | null;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
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
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                name: string;
                description: string | null;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            subtotal: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    delete(id: string, businessId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

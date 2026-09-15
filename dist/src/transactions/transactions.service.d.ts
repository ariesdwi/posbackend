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
            subtotal: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: Prisma.Decimal;
        discountNotes: string | null;
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
            subtotal: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: Prisma.Decimal;
        discountNotes: string | null;
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
            subtotal: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: Prisma.Decimal;
        discountNotes: string | null;
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
            subtotal: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: Prisma.Decimal;
        discountNotes: string | null;
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
            subtotal: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: Prisma.Decimal;
        discountNotes: string | null;
    }>;
    update(id: string, updateDto: UpdateTransactionDto, businessId: string, isAdmin?: boolean): Promise<{
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
            subtotal: Prisma.Decimal;
            costPrice: Prisma.Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: Prisma.Decimal;
        discountNotes: string | null;
    }>;
    delete(id: string, businessId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    voidTransaction(id: string, reason: string, notes: string | undefined, userId: string, businessId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            transactionNumber: string;
            voidedAt: Date | null;
            voidedBy: string;
            reason: string;
        };
    }>;
}

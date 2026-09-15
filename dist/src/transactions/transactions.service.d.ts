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
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: Prisma.Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        tableNumber: string | null;
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
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: Prisma.Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        tableNumber: string | null;
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
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: Prisma.Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        tableNumber: string | null;
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
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: Prisma.Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        tableNumber: string | null;
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
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: Prisma.Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        tableNumber: string | null;
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
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: Prisma.Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: Prisma.Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: Prisma.Decimal | null;
        changeAmount: Prisma.Decimal | null;
        tableNumber: string | null;
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

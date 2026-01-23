import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionStatusDto, CheckoutDto, UpdateTransactionDto } from './dto/transaction.dto';
import type { RequestUser } from '../common/decorators/user.decorator';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto, user: RequestUser): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    checkout(id: string, checkoutDto: CheckoutDto, user: RequestUser): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    findAll(user: RequestUser, startDate?: string, endDate?: string, status?: string, userId?: string, tableNumber?: string): Promise<({
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    })[]>;
    findOne(id: string, user: RequestUser): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    update(id: string, updateTransactionDto: UpdateTransactionDto, user: RequestUser): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateTransactionStatusDto, user: RequestUser): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        transactionNumber: string;
        userId: string;
        tableNumber: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
    }>;
    delete(id: string, user: RequestUser): Promise<{
        success: boolean;
        message: string;
    }>;
}

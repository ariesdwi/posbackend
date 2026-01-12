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
                name: string;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
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
                name: string;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
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
                name: string;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
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
                name: string;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
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
                name: string;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
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
                name: string;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
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
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
    }>;
}

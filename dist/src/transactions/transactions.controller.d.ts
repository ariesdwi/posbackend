import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionStatusDto, CheckoutDto, UpdateTransactionDto } from './dto/transaction.dto';
import type { RequestUser } from '../common/decorators/user.decorator';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto, user: RequestUser): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
    }>;
    checkout(id: string, checkoutDto: CheckoutDto, user: RequestUser): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
    }>;
    findAll(user: RequestUser, startDate?: string, endDate?: string, status?: string, userId?: string, tableNumber?: string): Promise<({
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
    })[]>;
    findOne(id: string, user: RequestUser): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
    }>;
    update(id: string, updateTransactionDto: UpdateTransactionDto, user: RequestUser): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateTransactionStatusDto, user: RequestUser): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string;
            productId: string | null;
            productName: string;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
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
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
    }>;
    delete(id: string, user: RequestUser): Promise<{
        success: boolean;
        message: string;
    }>;
}

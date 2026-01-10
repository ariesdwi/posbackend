import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionStatusDto, CheckoutDto } from './dto/transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto, user: any): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            productName: string;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
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
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            productName: string;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
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
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            productName: string;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
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
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            productName: string;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
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
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
            } | null;
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            productName: string;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        transactionNumber: string;
        tableNumber: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
        userId: string;
    }>;
}

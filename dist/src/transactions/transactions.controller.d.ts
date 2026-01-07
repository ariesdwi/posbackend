import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionStatusDto } from './dto/transaction.dto';
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
            };
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: string;
            quantity: number;
            productName: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
        transactionNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        userId: string;
    }>;
    findAll(startDate?: string, endDate?: string, status?: string, userId?: string): Promise<({
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
            };
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: string;
            quantity: number;
            productName: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
        transactionNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
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
            };
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: string;
            quantity: number;
            productName: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
        transactionNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
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
            };
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: string;
            quantity: number;
            productName: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        notes: string | null;
        transactionNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        userId: string;
    }>;
}

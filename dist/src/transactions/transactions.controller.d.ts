import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionStatusDto, CheckoutDto, UpdateTransactionDto } from './dto/transaction.dto';
import { VoidTransactionDto } from '../shifts/dto/phase1.dto';
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
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        tableNumber: string | null;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        discountNotes: string | null;
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
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        tableNumber: string | null;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        discountNotes: string | null;
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
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        tableNumber: string | null;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        discountNotes: string | null;
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
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        tableNumber: string | null;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        discountNotes: string | null;
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
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        tableNumber: string | null;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        discountNotes: string | null;
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
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                categoryId: string;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
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
        userId: string;
        notes: string | null;
        transactionNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        tableNumber: string | null;
        shiftId: string | null;
        isVoid: boolean;
        voidReason: string | null;
        voidedAt: Date | null;
        voidedBy: string | null;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        discountNotes: string | null;
    }>;
    delete(id: string, user: RequestUser): Promise<{
        success: boolean;
        message: string;
    }>;
    voidTransaction(id: string, dto: VoidTransactionDto, user: RequestUser): Promise<{
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

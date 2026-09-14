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
                description: string | null;
                id: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                name: string;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        notes: string | null;
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
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
                description: string | null;
                id: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                name: string;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        notes: string | null;
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
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
                description: string | null;
                id: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                name: string;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        notes: string | null;
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
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
                description: string | null;
                id: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                name: string;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        notes: string | null;
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
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
                description: string | null;
                id: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                name: string;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        notes: string | null;
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
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
                description: string | null;
                id: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                costPrice: import("@prisma/client-runtime-utils").Decimal;
                name: string;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            } | null;
        } & {
            id: string;
            productName: string;
            quantity: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            productId: string | null;
            transactionId: string;
        })[];
    } & {
        notes: string | null;
        id: string;
        transactionNumber: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod | null;
        paymentAmount: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.TransactionStatus;
        createdAt: Date;
        updatedAt: Date;
        tableNumber: string | null;
        businessId: string;
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

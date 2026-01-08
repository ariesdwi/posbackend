import { PaymentMethod, TransactionStatus } from '@prisma/client';
export declare class TransactionItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateTransactionDto {
    items: TransactionItemDto[];
    tableNumber?: string;
    paymentMethod?: PaymentMethod;
    paymentAmount?: number;
    status?: TransactionStatus;
    notes?: string;
}
export declare class UpdateTransactionStatusDto {
    status: TransactionStatus;
}
export declare class CheckoutDto {
    paymentMethod: PaymentMethod;
    paymentAmount: number;
    notes?: string;
}

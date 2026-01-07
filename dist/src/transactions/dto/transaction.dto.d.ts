import { PaymentMethod, TransactionStatus } from '@prisma/client';
export declare class TransactionItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateTransactionDto {
    items: TransactionItemDto[];
    paymentMethod: PaymentMethod;
    paymentAmount?: number;
    notes?: string;
}
export declare class UpdateTransactionStatusDto {
    status: TransactionStatus;
}

export declare class KasirActivityQueryDto {
    date?: string;
}
export declare class KasirPerformanceQueryDto {
    startDate?: string;
    endDate?: string;
}
export declare class KasirDailyDetailQueryDto {
    date?: string;
}
export declare class ProductSalesDetail {
    productId: string;
    productName: string;
    categoryName: string;
    quantitySold: number;
    revenue: number;
    costPrice: number;
    profit: number;
    profitMargin: number;
    percentage: number;
}
export declare class PaymentMethodDetail {
    method: string;
    totalSales: number;
    totalTransactions: number;
    percentage: number;
    expectedCashFromSales?: number;
}
export declare class TransactionDetail {
    transactionNumber: string;
    time: string;
    totalAmount: number;
    paymentMethod: string;
    items: Array<{
        productName: string;
        quantity: number;
        price: number;
        subtotal: number;
    }>;
}
export declare class KasirDailyDetailResponseDto {
    date: string;
    kasirId: string;
    kasirName: string;
    summary: {
        totalSales: number;
        totalTransactions: number;
        totalProfit: number;
        profitMargin: number;
        itemsSold: number;
    };
    productBreakdown: ProductSalesDetail[];
    paymentMethodBreakdown: PaymentMethodDetail[];
    transactions: TransactionDetail[];
    shiftInfo?: {
        shiftId: string;
        startTime: string;
        endTime: string | null;
        status: string;
        initialCash: number;
        expectedCash: number;
    };
}

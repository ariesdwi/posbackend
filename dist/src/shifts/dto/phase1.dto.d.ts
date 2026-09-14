export declare class XReportResponseDto {
    reportType: 'X-REPORT';
    reportNumber: string;
    generatedAt: Date;
    shift: {
        shiftId: string;
        kasirName: string;
        startTime: Date;
        duration: string;
        status: string;
    };
    summary: {
        totalSales: number;
        totalTransactions: number;
        averageTransaction: number;
        itemsSold: number;
    };
    paymentMethodBreakdown: {
        cash: {
            totalSales: number;
            transactions: number;
            percentage: number;
        };
        qris: {
            totalSales: number;
            transactions: number;
            percentage: number;
        };
        debit: {
            totalSales: number;
            transactions: number;
            percentage: number;
        };
        grabfood: {
            totalSales: number;
            transactions: number;
            percentage: number;
        };
        shopeefood: {
            totalSales: number;
            transactions: number;
            percentage: number;
        };
        gofood: {
            totalSales: number;
            transactions: number;
            percentage: number;
        };
        other: {
            totalSales: number;
            transactions: number;
            percentage: number;
        };
    };
    voidSummary: {
        totalVoidCount: number;
        totalVoidAmount: number;
    };
    discountSummary: {
        totalDiscountGiven: number;
        averageDiscount: number;
    };
    topProducts: Array<{
        productName: string;
        quantitySold: number;
        revenue: number;
    }>;
    cashReconciliation: {
        initialCash: number;
        cashSales: number;
        expectedCash: number;
        note: string;
    };
}
export declare class ZReportResponseDto {
    reportType: 'Z-REPORT';
    reportNumber: string;
    generatedAt: Date;
    shift: {
        shiftId: string;
        kasirName: string;
        startTime: Date;
        endTime: Date;
        duration: string;
        status: string;
    };
    salesSummary: {
        totalSales: number;
        totalTransactions: number;
        averageTransaction: number;
        itemsSold: number;
    };
    paymentMethodBreakdown: {
        cash: {
            totalSales: number;
            transactions: number;
            percentage: number;
            reconciliation: {
                expected: number;
                settlement: number | null;
                difference: number;
                status: 'MATCHED' | 'SHORT' | 'OVER' | 'NOT_VERIFIED';
            };
        };
        qris: {
            totalSales: number;
            transactions: number;
            percentage: number;
            reconciliation: {
                expected: number;
                settlement: number | null;
                difference: number;
                status: 'MATCHED' | 'SHORT' | 'OVER' | 'NOT_VERIFIED';
            };
        };
        debit: {
            totalSales: number;
            transactions: number;
            percentage: number;
            reconciliation: {
                expected: number;
                settlement: number | null;
                difference: number;
                status: 'MATCHED' | 'SHORT' | 'OVER' | 'NOT_VERIFIED';
            };
        };
        grabfood: {
            totalSales: number;
            transactions: number;
            percentage: number;
            reconciliation: {
                expected: number;
                settlement: number | null;
                difference: number;
                status: 'MATCHED' | 'SHORT' | 'OVER' | 'NOT_VERIFIED';
            };
        };
        shopeefood: {
            totalSales: number;
            transactions: number;
            percentage: number;
            reconciliation: {
                expected: number;
                settlement: number | null;
                difference: number;
                status: 'MATCHED' | 'SHORT' | 'OVER' | 'NOT_VERIFIED';
            };
        };
        gofood: {
            totalSales: number;
            transactions: number;
            percentage: number;
            reconciliation: {
                expected: number;
                settlement: number | null;
                difference: number;
                status: 'MATCHED' | 'SHORT' | 'OVER' | 'NOT_VERIFIED';
            };
        };
        other: {
            totalSales: number;
            transactions: number;
            percentage: number;
            reconciliation: {
                expected: number;
                settlement: number | null;
                difference: number;
                status: 'MATCHED' | 'SHORT' | 'OVER' | 'NOT_VERIFIED';
            };
        };
    };
    cashReconciliation: {
        initialCash: number;
        cashSales: number;
        expectedCash: number;
        finalCash: number;
        cashDifference: number;
        status: 'PERFECT_MATCH' | 'SHORT' | 'OVER';
    };
    voidSummary: {
        totalVoidCount: number;
        totalVoidAmount: number;
        voidTransactions: Array<{
            transactionNumber: string;
            amount: number;
            reason: string;
            voidedAt: Date;
        }>;
    };
    discountSummary: {
        totalDiscountGiven: number;
        discountCount: number;
        averageDiscount: number;
    };
    topProducts: Array<{
        productName: string;
        quantitySold: number;
        revenue: number;
        profitMargin: number;
    }>;
    xReportHistory: {
        totalXReports: number;
        lastXReportAt: Date | null;
    };
    notes: {
        shiftNotes: string | null;
        technicalIssues: string | null;
        inventoryNotes: string | null;
    };
}
export declare class PreCloseShiftDto {
    finalCash: number;
    edcSettlement?: number;
    qrisSettlement?: number;
    notes?: string;
    technicalIssues?: string;
    inventoryNotes?: string;
}
export declare class PreCloseShiftResponseDto {
    shiftId: string;
    status: 'CLOSED';
    previewZReport: {
        cashDifference: number;
        reconciliationStatus: 'MATCHED' | 'SHORT' | 'OVER';
        warnings: string[];
    };
    message: string;
}
export declare class VoidTransactionDto {
    reason: string;
    notes?: string;
}
export declare class VoidTransactionResponseDto {
    transactionNumber: string;
    voidedAt: Date;
    voidedBy: string;
    message: string;
}

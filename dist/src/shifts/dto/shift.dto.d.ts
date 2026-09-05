export declare class StartShiftDto {
    initialCash?: number;
}
export declare class EndShiftDto {
    finalCash: number;
    notes?: string;
}
export declare class ShiftReportResponseDto {
    shiftId: string;
    kasirName: string;
    startTime: Date;
    endTime: Date | null;
    status: 'OPEN' | 'CLOSED';
    initialCash: number;
    finalCash: number | null;
    expectedCash: number;
    cashDifference: number | null;
    notes: string | null;
    salesByPaymentMethod: {
        cash: {
            totalSales: number;
            totalTransactions: number;
            expectedCashFromSales: number;
        };
        qris: {
            totalSales: number;
            totalTransactions: number;
        };
        debit: {
            totalSales: number;
            totalTransactions: number;
        };
        grabfood: {
            totalSales: number;
            totalTransactions: number;
        };
        shopeefood: {
            totalSales: number;
            totalTransactions: number;
        };
        gofood: {
            totalSales: number;
            totalTransactions: number;
        };
        other: {
            totalSales: number;
            totalTransactions: number;
        };
    };
    summary: {
        totalSales: number;
        totalTransactions: number;
        totalCashToDeposit: number;
        actualCashInHand: number | null;
    };
}
export declare class GetCurrentShiftResponseDto {
    hasOpenShift: boolean;
    shift?: ShiftReportResponseDto;
}

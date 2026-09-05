import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class StartShiftDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  initialCash?: number = 0;
}

export class EndShiftDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  finalCash: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ShiftReportResponseDto {
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
  
  // Sales breakdown by payment method
  salesByPaymentMethod: {
    cash: {
      totalSales: number;
      totalTransactions: number;
      expectedCashFromSales: number; // Total cash yang seharusnya ada dari penjualan
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
  
  // Summary
  summary: {
    totalSales: number; // Total semua penjualan
    totalTransactions: number; // Total semua transaksi
    totalCashToDeposit: number; // initialCash + expectedCashFromSales
    actualCashInHand: number | null; // finalCash (cash yang disetor kasir)
  };
}

export class GetCurrentShiftResponseDto {
  hasOpenShift: boolean;
  shift?: ShiftReportResponseDto;
}

import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class KasirActivityQueryDto {
  @ApiProperty({
    required: false,
    example: '2026-07-23',
    description: 'Date to filter (YYYY-MM-DD). Defaults to today.',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class KasirPerformanceQueryDto {
  @ApiProperty({
    required: false,
    example: '2026-07-01',
    description: 'Start date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    required: false,
    example: '2026-07-23',
    description: 'End date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}


// ============ KASIR DAILY DETAIL REPORT DTOs ============

export class KasirDailyDetailQueryDto {
  date?: string; // Optional, defaults to today
}

export class ProductSalesDetail {
  productId: string;
  productName: string;
  categoryName: string;
  quantitySold: number;
  revenue: number;
  costPrice: number;
  profit: number;
  profitMargin: number;
  percentage: number; // Percentage of total sales
}

export class PaymentMethodDetail {
  method: string;
  totalSales: number;
  totalTransactions: number;
  percentage: number;
  // For CASH only
  expectedCashFromSales?: number;
}

export class TransactionDetail {
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

export class KasirDailyDetailResponseDto {
  date: string;
  kasirId: string;
  kasirName: string;
  
  // Summary
  summary: {
    totalSales: number;
    totalTransactions: number;
    totalProfit: number;
    profitMargin: number;
    itemsSold: number;
  };
  
  // Breakdown by Product
  productBreakdown: ProductSalesDetail[];
  
  // Breakdown by Payment Method
  paymentMethodBreakdown: PaymentMethodDetail[];
  
  // Transaction List
  transactions: TransactionDetail[];
  
  // Shift Info (if available)
  shiftInfo?: {
    shiftId: string;
    startTime: string;
    endTime: string | null;
    status: string;
    initialCash: number;
    expectedCash: number;
  };
}

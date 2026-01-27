import { PrismaService } from '../prisma/prisma.service';
export interface ProductSale {
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
    totalCost: number;
    profit: number;
    marginPercentage: number;
}
export interface CategoryRevenue {
    category: string;
    revenue: number;
    itemsSold: number;
}
export interface TransactionSummary {
    id: string;
    transactionNumber: string;
    totalAmount: number;
    paymentMethod: string;
    cashier: string;
    itemCount: number;
    createdAt: Date;
}
export interface DailyTrend {
    date: string;
    revenue: number;
    profit: number;
}
export interface ReportData {
    period: {
        type: string;
        startDate: string;
        endDate: string;
    };
    summary: {
        totalRevenue: number;
        totalCost: number;
        totalProfit: number;
        totalTransactions: number;
        totalItemsSold: number;
        averageTransactionValue: number;
        averageMargin: number;
    };
    revenueByPaymentMethod: Record<string, number>;
    revenueByCashier: Record<string, number>;
    bestSellers: ProductSale[];
    dailyRevenue: DailyTrend[];
    transactions: TransactionSummary[];
}
export interface MarginReport {
    period: {
        startDate: string;
        endDate: string;
    };
    summary: {
        totalRevenue: number;
        totalCost: number;
        totalProfit: number;
    };
    items: ProductSale[];
}
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getCustomReport(startDate: string, endDate: string, businessId: string): Promise<{
        period: {
            type: string;
            startDate: string;
            endDate: string;
        };
        summary: {
            totalRevenue: number;
            totalCost: number;
            totalProfit: number;
            totalTransactions: number;
            totalItemsSold: number;
            averageTransactionValue: number;
            averageMargin: number;
        };
        revenueByPaymentMethod: Record<string, number>;
        revenueByCashier: Record<string, number>;
        bestSellers: ProductSale[];
        dailyRevenue: DailyTrend[];
        transactions: {
            id: string;
            transactionNumber: string;
            totalAmount: number;
            paymentMethod: string;
            cashier: string;
            itemCount: number;
            createdAt: Date;
        }[];
    }>;
    getDailyReport(date: string, businessId: string): Promise<{
        period: {
            type: string;
            startDate: string;
            endDate: string;
        };
        summary: {
            totalRevenue: number;
            totalCost: number;
            totalProfit: number;
            totalTransactions: number;
            totalItemsSold: number;
            averageTransactionValue: number;
            averageMargin: number;
        };
        revenueByPaymentMethod: Record<string, number>;
        revenueByCashier: Record<string, number>;
        bestSellers: ProductSale[];
        dailyRevenue: DailyTrend[];
        transactions: {
            id: string;
            transactionNumber: string;
            totalAmount: number;
            paymentMethod: string;
            cashier: string;
            itemCount: number;
            createdAt: Date;
        }[];
    }>;
    getWeeklyReport(startDate: string, businessId: string): Promise<{
        period: {
            type: string;
            startDate: string;
            endDate: string;
        };
        summary: {
            totalRevenue: number;
            totalCost: number;
            totalProfit: number;
            totalTransactions: number;
            totalItemsSold: number;
            averageTransactionValue: number;
            averageMargin: number;
        };
        revenueByPaymentMethod: Record<string, number>;
        revenueByCashier: Record<string, number>;
        bestSellers: ProductSale[];
        dailyRevenue: DailyTrend[];
        transactions: {
            id: string;
            transactionNumber: string;
            totalAmount: number;
            paymentMethod: string;
            cashier: string;
            itemCount: number;
            createdAt: Date;
        }[];
    }>;
    getMonthlyReport(month: string, businessId: string): Promise<{
        period: {
            type: string;
            startDate: string;
            endDate: string;
        };
        summary: {
            totalRevenue: number;
            totalCost: number;
            totalProfit: number;
            totalTransactions: number;
            totalItemsSold: number;
            averageTransactionValue: number;
            averageMargin: number;
        };
        revenueByPaymentMethod: Record<string, number>;
        revenueByCashier: Record<string, number>;
        bestSellers: ProductSale[];
        dailyRevenue: DailyTrend[];
        transactions: {
            id: string;
            transactionNumber: string;
            totalAmount: number;
            paymentMethod: string;
            cashier: string;
            itemCount: number;
            createdAt: Date;
        }[];
    }>;
    private getReportForPeriod;
    getMarginReport(startDate: string, endDate: string, businessId: string): Promise<MarginReport>;
    getBestSellers(period: 'daily' | 'weekly' | 'monthly', businessId: string, limit?: number): Promise<ProductSale[]>;
    getRevenueByCategory(startDate: string, endDate: string, businessId: string): Promise<CategoryRevenue[]>;
    generatePDFReport(reportData: ReportData): Promise<Buffer>;
    private formatCurrency;
}

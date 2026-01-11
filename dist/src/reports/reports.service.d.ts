import { PrismaService } from '../prisma/prisma.service';
export interface ProductSale {
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
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
export interface ReportData {
    period: {
        type: string;
        startDate: string;
        endDate: string;
    };
    summary: {
        totalRevenue: number;
        totalTransactions: number;
        totalItemsSold: number;
        averageTransactionValue: number;
    };
    revenueByPaymentMethod: Record<string, number>;
    revenueByCashier: Record<string, number>;
    bestSellers: ProductSale[];
    transactions: TransactionSummary[];
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
            totalTransactions: number;
            totalItemsSold: number;
            averageTransactionValue: number;
        };
        revenueByPaymentMethod: Record<string, number>;
        revenueByCashier: Record<string, number>;
        bestSellers: ProductSale[];
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
            totalTransactions: number;
            totalItemsSold: number;
            averageTransactionValue: number;
        };
        revenueByPaymentMethod: Record<string, number>;
        revenueByCashier: Record<string, number>;
        bestSellers: ProductSale[];
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
            totalTransactions: number;
            totalItemsSold: number;
            averageTransactionValue: number;
        };
        revenueByPaymentMethod: Record<string, number>;
        revenueByCashier: Record<string, number>;
        bestSellers: ProductSale[];
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
            totalTransactions: number;
            totalItemsSold: number;
            averageTransactionValue: number;
        };
        revenueByPaymentMethod: Record<string, number>;
        revenueByCashier: Record<string, number>;
        bestSellers: ProductSale[];
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
    getBestSellers(period: 'daily' | 'weekly' | 'monthly', businessId: string, limit?: number): Promise<ProductSale[]>;
    getRevenueByCategory(startDate: string, endDate: string, businessId: string): Promise<CategoryRevenue[]>;
    generatePDFReport(reportData: ReportData): Promise<Buffer>;
    private formatCurrency;
}

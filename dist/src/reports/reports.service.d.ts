import { PrismaService } from '../prisma/prisma.service';
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
        bestSellers: any[];
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
        bestSellers: any[];
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
        bestSellers: any[];
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
        bestSellers: any[];
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
    getBestSellers(period: 'daily' | 'weekly' | 'monthly', businessId: string, limit?: number): Promise<any[]>;
    getRevenueByCategory(startDate: string, endDate: string, businessId: string): Promise<any[]>;
    generatePDFReport(reportData: any): Promise<Buffer>;
    private formatCurrency;
}

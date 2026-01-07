import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDailyReport(date: string): Promise<{
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
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            cashier: string;
            itemCount: number;
            createdAt: Date;
        }[];
    }>;
    getWeeklyReport(startDate: string): Promise<{
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
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            cashier: string;
            itemCount: number;
            createdAt: Date;
        }[];
    }>;
    getMonthlyReport(month: string): Promise<{
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
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            cashier: string;
            itemCount: number;
            createdAt: Date;
        }[];
    }>;
    private getReportForPeriod;
    getBestSellers(period: 'daily' | 'weekly' | 'monthly', limit?: number): Promise<any[]>;
    getRevenueByCategory(startDate: string, endDate: string): Promise<any[]>;
}

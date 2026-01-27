import type { Response } from 'express';
import { ReportsService } from './reports.service';
import type { RequestUser } from '../common/decorators/user.decorator';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getCustomReport(startDate: string, endDate: string, user: RequestUser): Promise<{
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
        bestSellers: import("./reports.service").ProductSale[];
        dailyRevenue: import("./reports.service").DailyTrend[];
        transactions: {
            id: string;
            transactionNumber: string;
            totalAmount: number;
            paymentMethod: string;
            cashier: string;
            itemCount: number;
            items: {
                productName: string;
                quantity: number;
                price: number;
                subtotal: number;
            }[];
            createdAt: Date;
        }[];
    }>;
    getDailyReport(date: string, user: RequestUser): Promise<{
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
        bestSellers: import("./reports.service").ProductSale[];
        dailyRevenue: import("./reports.service").DailyTrend[];
        transactions: {
            id: string;
            transactionNumber: string;
            totalAmount: number;
            paymentMethod: string;
            cashier: string;
            itemCount: number;
            items: {
                productName: string;
                quantity: number;
                price: number;
                subtotal: number;
            }[];
            createdAt: Date;
        }[];
    }>;
    getWeeklyReport(startDate: string, user: RequestUser): Promise<{
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
        bestSellers: import("./reports.service").ProductSale[];
        dailyRevenue: import("./reports.service").DailyTrend[];
        transactions: {
            id: string;
            transactionNumber: string;
            totalAmount: number;
            paymentMethod: string;
            cashier: string;
            itemCount: number;
            items: {
                productName: string;
                quantity: number;
                price: number;
                subtotal: number;
            }[];
            createdAt: Date;
        }[];
    }>;
    getMonthlyReport(month: string, user: RequestUser): Promise<{
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
        bestSellers: import("./reports.service").ProductSale[];
        dailyRevenue: import("./reports.service").DailyTrend[];
        transactions: {
            id: string;
            transactionNumber: string;
            totalAmount: number;
            paymentMethod: string;
            cashier: string;
            itemCount: number;
            items: {
                productName: string;
                quantity: number;
                price: number;
                subtotal: number;
            }[];
            createdAt: Date;
        }[];
    }>;
    getBestSellers(period: "daily" | "weekly" | "monthly" | undefined, user: RequestUser, limit?: string): Promise<import("./reports.service").ProductSale[]>;
    getRevenueByCategory(startDate: string, endDate: string, user: RequestUser): Promise<import("./reports.service").CategoryRevenue[]>;
    getMarginReport(startDate: string, endDate: string, user: RequestUser): Promise<import("./reports.service").MarginReport>;
    exportPDF(res: Response, type: 'daily' | 'weekly' | 'monthly' | 'custom', user: RequestUser, date?: string, startDate?: string, endDate?: string, month?: string): Promise<Response<any, Record<string, any>> | undefined>;
    exportTransactionsPDF(res: Response, startDate: string, endDate: string, user: RequestUser): Promise<Response<any, Record<string, any>> | undefined>;
}

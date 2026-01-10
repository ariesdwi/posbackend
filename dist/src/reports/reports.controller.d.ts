import type { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getCustomReport(startDate: string, endDate: string): Promise<{
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
            paymentMethod: string;
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
            paymentMethod: string;
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
            paymentMethod: string;
            cashier: string;
            itemCount: number;
            createdAt: Date;
        }[];
    }>;
    getBestSellers(period?: 'daily' | 'weekly' | 'monthly', limit?: string): Promise<any[]>;
    getRevenueByCategory(startDate: string, endDate: string): Promise<any[]>;
    exportPDF(res: Response, type: 'daily' | 'weekly' | 'monthly' | 'custom', date?: string, startDate?: string, endDate?: string, month?: string): Promise<Response<any, Record<string, any>> | undefined>;
}

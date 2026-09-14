import type { Response } from 'express';
import { ReportsService } from './reports.service';
import type { RequestUser } from '../common/decorators/user.decorator';
import { KasirActivityQueryDto, KasirPerformanceQueryDto, KasirDailyDetailQueryDto } from './dto/kasir-reports.dto';
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
    getKasirActivity(query: KasirActivityQueryDto, user: RequestUser): Promise<{
        date: string;
        kasirs: {
            id: string;
            name: string;
            email: string;
            firstLoginToday: string | null;
            lastActivity: string | null;
            workDuration: string | null;
            totalTransactions: number;
            totalRevenue: number;
            status: string;
        }[];
        summary: {
            totalKasir: number;
            totalTransactions: number;
            totalRevenue: number;
        };
    }>;
    getKasirPerformance(query: KasirPerformanceQueryDto, user: RequestUser): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        kasirs: {
            id: string;
            name: string;
            email: string;
            workDays: number;
            totalTransactions: number;
            totalRevenue: number;
            totalCost: number;
            totalProfit: number;
            totalItemsSold: number;
            avgTransactionPerDay: number;
            avgRevenuePerDay: number;
            avgTransactionValue: number;
        }[];
        summary: {
            totalKasir: number;
            totalTransactions: number;
            totalRevenue: number;
            totalProfit: number;
        };
    }>;
    getKasirDailyDetail(query: KasirDailyDetailQueryDto, user: RequestUser): Promise<{
        date: string;
        kasirId: string;
        kasirName: string;
        summary: {
            totalSales: number;
            totalTransactions: number;
            totalProfit: number;
            profitMargin: number;
            itemsSold: number;
        };
        productBreakdown: {
            productId: string;
            productName: string;
            categoryName: string;
            quantitySold: number;
            revenue: number;
            costPrice: number;
            profit: number;
            profitMargin: number;
            percentage: number;
        }[];
        paymentMethodBreakdown: any[];
        transactions: {
            transactionNumber: string;
            time: string;
            totalAmount: number;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            items: {
                productName: string;
                quantity: number;
                price: number;
                subtotal: number;
            }[];
        }[];
        shiftInfo: {
            shiftId: string;
            startTime: string;
            endTime: string | null;
            status: import("@prisma/client").$Enums.ShiftStatus;
            initialCash: number;
            expectedCash: number;
        } | null;
    }>;
}

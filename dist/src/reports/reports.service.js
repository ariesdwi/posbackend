"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDailyReport(date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        return this.getReportForPeriod(startDate, endDate, 'Daily');
    }
    async getWeeklyReport(startDate) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        return this.getReportForPeriod(start, end, 'Weekly');
    }
    async getMonthlyReport(month) {
        const [year, monthNum] = month.split('-').map(Number);
        const start = new Date(year, monthNum - 1, 1);
        const end = new Date(year, monthNum, 0, 23, 59, 59, 999);
        return this.getReportForPeriod(start, end, 'Monthly');
    }
    async getReportForPeriod(startDate, endDate, periodType) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                status: 'COMPLETED',
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
        const totalTransactions = transactions.length;
        const totalItemsSold = transactions.reduce((sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        const revenueByPaymentMethod = transactions.reduce((acc, t) => {
            const method = t.paymentMethod || 'UNKNOWN';
            acc[method] = (acc[method] || 0) + Number(t.totalAmount);
            return acc;
        }, {});
        const revenueByCashier = transactions.reduce((acc, t) => {
            const cashier = t.user.name;
            acc[cashier] = (acc[cashier] || 0) + Number(t.totalAmount);
            return acc;
        }, {});
        const productSales = transactions.reduce((acc, t) => {
            t.items.forEach((item) => {
                if (!acc[item.productId]) {
                    acc[item.productId] = {
                        productId: item.productId,
                        productName: item.productName,
                        quantitySold: 0,
                        revenue: 0,
                    };
                }
                acc[item.productId].quantitySold += item.quantity;
                acc[item.productId].revenue += Number(item.subtotal);
            });
            return acc;
        }, {});
        const bestSellers = Object.values(productSales)
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, 10);
        return {
            period: {
                type: periodType,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            },
            summary: {
                totalRevenue,
                totalTransactions,
                totalItemsSold,
                averageTransactionValue: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
            },
            revenueByPaymentMethod,
            revenueByCashier,
            bestSellers,
            transactions: transactions.map((t) => ({
                id: t.id,
                transactionNumber: t.transactionNumber,
                totalAmount: Number(t.totalAmount),
                paymentMethod: t.paymentMethod,
                cashier: t.user.name,
                itemCount: t.items.length,
                createdAt: t.createdAt,
            })),
        };
    }
    async getBestSellers(period, limit = 10) {
        let startDate;
        const endDate = new Date();
        switch (period) {
            case 'daily':
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'weekly':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'monthly':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                break;
        }
        const transactions = await this.prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                status: 'COMPLETED',
            },
            include: {
                items: true,
            },
        });
        const productSales = transactions.reduce((acc, t) => {
            t.items.forEach((item) => {
                if (!acc[item.productId]) {
                    acc[item.productId] = {
                        productId: item.productId,
                        productName: item.productName,
                        quantitySold: 0,
                        revenue: 0,
                    };
                }
                acc[item.productId].quantitySold += item.quantity;
                acc[item.productId].revenue += Number(item.subtotal);
            });
            return acc;
        }, {});
        return Object.values(productSales)
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, limit);
    }
    async getRevenueByCategory(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const transactions = await this.prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
                status: 'COMPLETED',
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
        });
        const revenueByCategory = transactions.reduce((acc, t) => {
            t.items.forEach((item) => {
                const categoryName = item.product.category.name;
                if (!acc[categoryName]) {
                    acc[categoryName] = {
                        category: categoryName,
                        revenue: 0,
                        itemsSold: 0,
                    };
                }
                acc[categoryName].revenue += Number(item.subtotal);
                acc[categoryName].itemsSold += item.quantity;
            });
            return acc;
        }, {});
        return Object.values(revenueByCategory).sort((a, b) => b.revenue - a.revenue);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map
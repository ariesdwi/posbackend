import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDailyReport(date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return this.getReportForPeriod(startDate, endDate, 'Daily');
  }

  async getWeeklyReport(startDate: string) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return this.getReportForPeriod(start, end, 'Weekly');
  }

  async getMonthlyReport(month: string) {
    const [year, monthNum] = month.split('-').map(Number);
    const start = new Date(year, monthNum - 1, 1);
    const end = new Date(year, monthNum, 0, 23, 59, 59, 999);

    return this.getReportForPeriod(start, end, 'Monthly');
  }

  private async getReportForPeriod(
    startDate: Date,
    endDate: Date,
    periodType: string,
  ) {
    // Get all transactions in period
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

    // Calculate totals
    const totalRevenue = transactions.reduce(
      (sum, t) => sum + Number(t.totalAmount),
      0,
    );
    const totalTransactions = transactions.length;
    const totalItemsSold = transactions.reduce(
      (sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    );

    // Revenue by payment method
    const revenueByPaymentMethod = transactions.reduce((acc, t) => {
      const method = (t.paymentMethod as string) || 'UNKNOWN';
      acc[method] = (acc[method] || 0) + Number(t.totalAmount);
      return acc;
    }, {} as Record<string, number>);

    // Revenue by cashier
    const revenueByCashier = transactions.reduce((acc, t) => {
      const cashier = t.user.name;
      acc[cashier] = (acc[cashier] || 0) + Number(t.totalAmount);
      return acc;
    }, {} as Record<string, number>);

    // Best selling products
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
    }, {} as Record<string, any>);

    const bestSellers = Object.values(productSales)
      .sort((a: any, b: any) => b.quantitySold - a.quantitySold)
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
        averageTransactionValue:
          totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
      },
      revenueByPaymentMethod,
      revenueByCashier,
      bestSellers,
      transactions: transactions.map((t) => ({
        id: t.id,
        transactionNumber: t.transactionNumber,
        totalAmount: Number(t.totalAmount),
        paymentMethod: t.paymentMethod as string,
        cashier: t.user.name,
        itemCount: t.items.length,
        createdAt: t.createdAt,
      })),
    };
  }

  async getBestSellers(period: 'daily' | 'weekly' | 'monthly', limit = 10) {
    let startDate: Date;
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
    }, {} as Record<string, any>);

    return Object.values(productSales)
      .sort((a: any, b: any) => b.quantitySold - a.quantitySold)
      .slice(0, limit);
  }

  async getRevenueByCategory(startDate: string, endDate: string) {
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
    }, {} as Record<string, any>);

    return Object.values(revenueByCategory).sort(
      (a: any, b: any) => b.revenue - a.revenue,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getCustomReport(startDate: string, endDate: string) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return this.getReportForPeriod(start, end, 'Custom');
  }

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

  async generatePDFReport(reportData: any): Promise<Buffer> {
    const primaryColor = '#7c68ee'; // Indigo branding
    const secondaryColor = '#64748b'; // Slate 500
    const accentColor = '#0ea5e9'; // Sky 500
    const lightBg = '#f8fafc'; // Slate 50
    const foregroundColor = '#0f172a'; // Slate 900
    const borderColor = '#e2e8f0';

    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Helper: Add Footer
      const addFooter = () => {
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(8)
            .fillColor(secondaryColor)
            .text(
              `Dicetak pada: ${new Date().toLocaleString('id-ID')} | Halaman ${i + 1} dari ${pages.count}`,
              50,
              doc.page.height - 50,
              { align: 'center', width: doc.page.width - 100 },
            );
        }
      };

      // Header Bar
      doc.rect(0, 0, doc.page.width, 100).fill(primaryColor);
      doc
        .fillColor('#ffffff')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('LAPORAN PENJUALAN', 50, 40);
      
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(reportData.period.type.toUpperCase(), 50, 70);

      // Reset text color
      doc.fillColor(foregroundColor).moveDown(4);

      // Period Info
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('Periode Laporan:')
        .font('Helvetica')
        .text(
          `${new Date(reportData.period.startDate).toLocaleDateString('id-ID')} - ${new Date(reportData.period.endDate).toLocaleDateString('id-ID')}`,
        )
        .moveDown();

      // Summary Boxes
      const boxWidth = 120;
      const boxHeight = 60;
      const startX = 50;
      let currentX = startX;
      let currentY = doc.y;

      const stats = [
        { label: 'PENDAPATAN', value: this.formatCurrency(reportData.summary.totalRevenue) },
        { label: 'TRANSAKSI', value: reportData.summary.totalTransactions.toString() },
        { label: 'ITEM TERJUAL', value: reportData.summary.totalItemsSold.toString() },
        { label: 'RATA-RATA', value: this.formatCurrency(reportData.summary.averageTransactionValue) },
      ];

      stats.forEach((stat) => {
        doc.rect(currentX, currentY, boxWidth, boxHeight).fill(lightBg).stroke(borderColor);
        doc
          .fillColor(secondaryColor)
          .fontSize(8)
          .font('Helvetica-Bold')
          .text(stat.label, currentX + 10, currentY + 15);
        doc
          .fillColor(primaryColor)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(stat.value, currentX + 10, currentY + 30);
        
        currentX += boxWidth + 10;
      });

      doc.fillColor(foregroundColor).moveDown(5);

      // Breakdown Sections (Side by Side)
      const colWidth = (doc.page.width - 120) / 2;
      const sectionY = doc.y;

      // Left Column: Payment Methods
      doc.fontSize(14).font('Helvetica-Bold').text('Metode Pembayaran', 50, sectionY);
      doc.moveDown(0.5);
      Object.entries(reportData.revenueByPaymentMethod).forEach(([method, amount]) => {
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(`${method}:`, { continued: true })
          .font('Helvetica-Bold')
          .text(` ${this.formatCurrency(amount as number)}`);
      });

      // Right Column: Cashiers
      doc.fontSize(14).font('Helvetica-Bold').text('Performa Kasir', 50 + colWidth + 20, sectionY);
      doc.y = sectionY + 20;
      Object.entries(reportData.revenueByCashier).forEach(([cashier, amount]) => {
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(`${cashier}:`, 50 + colWidth + 20, doc.y, { continued: true })
          .font('Helvetica-Bold')
          .text(` ${this.formatCurrency(amount as number)}`);
      });

      doc.moveDown(2);

      // Best Sellers
      doc.fontSize(14).font('Helvetica-Bold').text('5 Produk Terlaris', 50, doc.y);
      doc.moveDown(0.5);
      
      const bestSellers = reportData.bestSellers.slice(0, 5);
      bestSellers.forEach((item: any, index: number) => {
        const itemY = doc.y;
        doc.rect(50, itemY - 5, doc.page.width - 100, 25).fill(index % 2 === 0 ? '#ffffff' : lightBg);
        doc
          .fillColor(foregroundColor)
          .fontSize(10)
          .font('Helvetica')
          .text(`${index + 1}. ${item.productName}`, 60, itemY)
          .font('Helvetica-Bold')
          .text(`${item.quantitySold} item - ${this.formatCurrency(item.revenue)}`, 350, itemY, { align: 'right', width: 180 });
      });

      // Transaction Table
      doc.addPage();
      doc.fontSize(16).font('Helvetica-Bold').text('Riwayat Transaksi').moveDown();

      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 180;
      const col3 = 350;
      const col4 = 480;

      // Table Header
      doc.rect(50, tableTop - 5, doc.page.width - 100, 25).fill(primaryColor);
      doc
        .fillColor('#ffffff')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('NO. TRANSAKSI', col1, tableTop)
        .text('KASIR', col2, tableTop)
        .text('TOTAL', col3, tableTop)
        .text('METODE', col4, tableTop);

      let currentTableY = tableTop + 25;

      reportData.transactions.forEach((t: any, index: number) => {
        if (currentTableY > 750) {
          doc.addPage();
          currentTableY = 50;
          // Redraw header on new page
          doc.rect(50, currentTableY - 5, doc.page.width - 100, 25).fill(primaryColor);
          doc
            .fillColor('#ffffff')
            .font('Helvetica-Bold')
            .text('NO. TRANSAKSI', col1, currentTableY)
            .text('KASIR', col2, currentTableY)
            .text('TOTAL', col3, currentTableY)
            .text('METODE', col4, currentTableY);
          currentTableY += 25;
        }

        // Zebra striping
        if (index % 2 !== 0) {
          doc.rect(50, currentTableY - 5, doc.page.width - 100, 20).fill(lightBg);
        }

        doc
          .fillColor(foregroundColor)
          .font('Helvetica')
          .fontSize(9)
          .text(t.transactionNumber, col1, currentTableY)
          .text(t.cashier, col2, currentTableY)
          .text(this.formatCurrency(t.totalAmount), col3, currentTableY)
          .text(t.paymentMethod || '-', col4, currentTableY);

        currentTableY += 20;
      });

      addFooter();
      doc.end();
    });
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

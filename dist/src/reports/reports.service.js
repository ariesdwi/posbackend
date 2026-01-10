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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pdfkit_1 = __importDefault(require("pdfkit"));
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCustomReport(startDate, endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return this.getReportForPeriod(start, end, 'Custom');
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
                if (!item.productId)
                    return;
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
                if (!item.productId)
                    return;
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
                const categoryName = item.product?.category?.name || 'Deleted Products';
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
    async generatePDFReport(reportData) {
        const primaryColor = '#7c68ee';
        const secondaryColor = '#64748b';
        const accentColor = '#0ea5e9';
        const lightBg = '#f8fafc';
        const foregroundColor = '#0f172a';
        const borderColor = '#e2e8f0';
        return new Promise((resolve) => {
            const doc = new pdfkit_1.default({ margin: 50, size: 'A4', bufferPages: true });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            const addFooter = () => {
                const pages = doc.bufferedPageRange();
                for (let i = 0; i < pages.count; i++) {
                    doc.switchToPage(i);
                    doc
                        .fontSize(8)
                        .fillColor(secondaryColor)
                        .text(`Dicetak pada: ${new Date().toLocaleString('id-ID')} | Halaman ${i + 1} dari ${pages.count}`, 50, doc.page.height - 50, { align: 'center', width: doc.page.width - 100 });
                }
            };
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
            doc.fillColor(foregroundColor).moveDown(4);
            doc
                .fontSize(11)
                .font('Helvetica-Bold')
                .text('Periode Laporan:')
                .font('Helvetica')
                .text(`${new Date(reportData.period.startDate).toLocaleDateString('id-ID')} - ${new Date(reportData.period.endDate).toLocaleDateString('id-ID')}`)
                .moveDown();
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
            const colWidth = (doc.page.width - 120) / 2;
            const sectionY = doc.y;
            doc.fontSize(14).font('Helvetica-Bold').text('Metode Pembayaran', 50, sectionY);
            doc.moveDown(0.5);
            Object.entries(reportData.revenueByPaymentMethod).forEach(([method, amount]) => {
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text(`${method}:`, { continued: true })
                    .font('Helvetica-Bold')
                    .text(` ${this.formatCurrency(amount)}`);
            });
            doc.fontSize(14).font('Helvetica-Bold').text('Performa Kasir', 50 + colWidth + 20, sectionY);
            doc.y = sectionY + 20;
            Object.entries(reportData.revenueByCashier).forEach(([cashier, amount]) => {
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text(`${cashier}:`, 50 + colWidth + 20, doc.y, { continued: true })
                    .font('Helvetica-Bold')
                    .text(` ${this.formatCurrency(amount)}`);
            });
            doc.moveDown(2);
            doc.fontSize(14).font('Helvetica-Bold').text('5 Produk Terlaris', 50, doc.y);
            doc.moveDown(0.5);
            const bestSellers = reportData.bestSellers.slice(0, 5);
            bestSellers.forEach((item, index) => {
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
            doc.addPage();
            doc.fontSize(16).font('Helvetica-Bold').text('Riwayat Transaksi').moveDown();
            const tableTop = doc.y;
            const col1 = 50;
            const col2 = 180;
            const col3 = 350;
            const col4 = 480;
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
            reportData.transactions.forEach((t, index) => {
                if (currentTableY > 750) {
                    doc.addPage();
                    currentTableY = 50;
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
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map
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
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ShiftsService = class ShiftsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async startShift(userId, businessId, dto) {
        const existingOpenShift = await this.prisma.shift.findFirst({
            where: {
                userId,
                businessId,
                status: 'OPEN',
            },
        });
        if (existingOpenShift) {
            throw new common_1.BadRequestException('Anda sudah memiliki shift yang sedang aktif. Selesaikan shift sebelumnya terlebih dahulu.');
        }
        const shift = await this.prisma.shift.create({
            data: {
                initialCash: new client_1.Prisma.Decimal(dto.initialCash || 0),
                status: 'OPEN',
                user: {
                    connect: { id: userId },
                },
                business: {
                    connect: { id: businessId },
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return this.buildShiftReport(shift, []);
    }
    async endShift(userId, businessId, dto) {
        const shift = await this.prisma.shift.findFirst({
            where: {
                userId,
                businessId,
                status: 'OPEN',
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                transactions: {
                    where: {
                        status: 'COMPLETED',
                    },
                },
            },
        });
        if (!shift) {
            throw new common_1.NotFoundException('Tidak ada shift aktif. Mulai shift terlebih dahulu.');
        }
        const voidTransactions = shift.transactions.filter((t) => t.isVoid);
        const totalVoidCount = voidTransactions.length;
        const totalVoidAmount = voidTransactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
        const totalDiscountAmount = shift.transactions.reduce((sum, t) => sum + Number(t.discountAmount || 0), 0);
        const cashTransactions = shift.transactions.filter((t) => t.paymentMethod === 'CASH' && !t.isVoid);
        const expectedCashFromSales = cashTransactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
        const expectedCash = Number(shift.initialCash) + expectedCashFromSales;
        const finalCash = dto.finalCash;
        const cashDifference = finalCash - expectedCash;
        const updatedShift = await this.prisma.shift.update({
            where: {
                id: shift.id,
            },
            data: {
                endTime: new Date(),
                status: 'CLOSED',
                finalCash: new client_1.Prisma.Decimal(finalCash),
                expectedCash: new client_1.Prisma.Decimal(expectedCash),
                cashDifference: new client_1.Prisma.Decimal(cashDifference),
                notes: dto.notes,
                totalVoidCount,
                totalVoidAmount: new client_1.Prisma.Decimal(totalVoidAmount),
                totalDiscountAmount: new client_1.Prisma.Decimal(totalDiscountAmount),
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                transactions: {
                    where: {
                        status: 'COMPLETED',
                    },
                },
            },
        });
        return this.buildShiftReport(updatedShift, updatedShift.transactions);
    }
    async getCurrentShift(userId, businessId) {
        const shift = await this.prisma.shift.findFirst({
            where: {
                userId,
                businessId,
                status: 'OPEN',
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                transactions: {
                    where: {
                        status: 'COMPLETED',
                    },
                },
            },
        });
        if (!shift) {
            return {
                hasOpenShift: false,
            };
        }
        return {
            hasOpenShift: true,
            shift: this.buildShiftReport(shift, shift.transactions),
        };
    }
    async getShiftById(shiftId, userId, businessId) {
        const shift = await this.prisma.shift.findFirst({
            where: {
                id: shiftId,
                userId,
                businessId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                transactions: {
                    where: {
                        status: 'COMPLETED',
                    },
                },
            },
        });
        if (!shift) {
            throw new common_1.NotFoundException('Shift tidak ditemukan');
        }
        return this.buildShiftReport(shift, shift.transactions);
    }
    buildShiftReport(shift, transactions) {
        const salesByPaymentMethod = {
            cash: { totalSales: 0, totalTransactions: 0, expectedCashFromSales: 0 },
            qris: { totalSales: 0, totalTransactions: 0 },
            debit: { totalSales: 0, totalTransactions: 0 },
            grabfood: { totalSales: 0, totalTransactions: 0 },
            shopeefood: { totalSales: 0, totalTransactions: 0 },
            gofood: { totalSales: 0, totalTransactions: 0 },
            other: { totalSales: 0, totalTransactions: 0 },
        };
        transactions.forEach((transaction) => {
            const amount = Number(transaction.totalAmount);
            const method = transaction.paymentMethod?.toLowerCase();
            switch (method) {
                case 'cash':
                    salesByPaymentMethod.cash.totalSales += amount;
                    salesByPaymentMethod.cash.totalTransactions += 1;
                    salesByPaymentMethod.cash.expectedCashFromSales += amount;
                    break;
                case 'qris':
                    salesByPaymentMethod.qris.totalSales += amount;
                    salesByPaymentMethod.qris.totalTransactions += 1;
                    break;
                case 'debit':
                    salesByPaymentMethod.debit.totalSales += amount;
                    salesByPaymentMethod.debit.totalTransactions += 1;
                    break;
                case 'grabfood':
                    salesByPaymentMethod.grabfood.totalSales += amount;
                    salesByPaymentMethod.grabfood.totalTransactions += 1;
                    break;
                case 'shopeefood':
                    salesByPaymentMethod.shopeefood.totalSales += amount;
                    salesByPaymentMethod.shopeefood.totalTransactions += 1;
                    break;
                case 'gofood':
                    salesByPaymentMethod.gofood.totalSales += amount;
                    salesByPaymentMethod.gofood.totalTransactions += 1;
                    break;
                default:
                    salesByPaymentMethod.other.totalSales += amount;
                    salesByPaymentMethod.other.totalTransactions += 1;
                    break;
            }
        });
        const totalSales = transactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
        const totalTransactions = transactions.length;
        const initialCash = Number(shift.initialCash);
        const cashSales = salesByPaymentMethod.cash.expectedCashFromSales;
        const expectedCash = initialCash + cashSales;
        const totalCashToDeposit = expectedCash;
        const actualCashInHand = shift.finalCash ? Number(shift.finalCash) : null;
        return {
            shiftId: shift.id,
            kasirName: shift.user.name,
            startTime: shift.startTime,
            endTime: shift.endTime,
            status: shift.status,
            initialCash,
            finalCash: actualCashInHand,
            expectedCash: expectedCash,
            cashDifference: shift.cashDifference ? Number(shift.cashDifference) : null,
            notes: shift.notes,
            salesByPaymentMethod,
            summary: {
                totalSales,
                totalTransactions,
                totalCashToDeposit,
                actualCashInHand,
            },
        };
    }
    async getXReport(userId, businessId) {
        const shift = await this.prisma.shift.findFirst({
            where: {
                businessId,
                status: 'OPEN',
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                transactions: {
                    where: {
                        status: 'COMPLETED',
                        isVoid: false,
                    },
                    include: {
                        items: true,
                    },
                },
            },
        });
        if (!shift) {
            const allShifts = await this.prisma.shift.findMany({
                where: { businessId },
                select: { id: true, status: true },
            });
            throw new common_1.NotFoundException(`Tidak ada shift aktif untuk business ini. ` +
                `Found ${allShifts.length} shifts total (businessId: ${businessId}). ` +
                `Statuses: ${allShifts.map(s => s.status).join(', ')}`);
        }
        const salesBreakdown = this.calculateSalesBreakdown(shift.transactions);
        const voidTransactions = await this.prisma.transaction.findMany({
            where: {
                shiftId: shift.id,
                isVoid: true,
            },
        });
        const voidSummary = {
            totalVoidCount: voidTransactions.length,
            totalVoidAmount: voidTransactions.reduce((sum, t) => sum + Number(t.totalAmount), 0),
        };
        const discountSummary = {
            totalDiscountGiven: shift.transactions.reduce((sum, t) => sum + Number(t.discountAmount || 0), 0),
            averageDiscount: shift.transactions.length > 0
                ? shift.transactions.reduce((sum, t) => sum + Number(t.discountAmount || 0), 0) / shift.transactions.length
                : 0,
        };
        const productMap = new Map();
        shift.transactions.forEach((t) => {
            t.items.forEach((item) => {
                const existing = productMap.get(item.productName);
                if (existing) {
                    existing.qty += item.quantity;
                    existing.revenue += Number(item.subtotal);
                }
                else {
                    productMap.set(item.productName, {
                        name: item.productName,
                        qty: item.quantity,
                        revenue: Number(item.subtotal),
                    });
                }
            });
        });
        const topProducts = Array.from(productMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((p) => ({
            productName: p.name,
            quantitySold: p.qty,
            revenue: p.revenue,
        }));
        const durationMs = Date.now() - shift.startTime.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const duration = `${hours} hours ${minutes} minutes`;
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
        const reportNumber = `X-${dateStr}-${timeStr}-${String(shift.xReportCount + 1).padStart(3, '0')}`;
        await this.prisma.$transaction(async (tx) => {
            await tx.xReport.create({
                data: {
                    shiftId: shift.id,
                    reportNumber,
                    generatedBy: userId,
                    totalSales: new client_1.Prisma.Decimal(salesBreakdown.totalSales),
                    totalTransactions: salesBreakdown.totalTransactions,
                    cashSales: new client_1.Prisma.Decimal(salesBreakdown.cash.totalSales),
                    qrisSales: new client_1.Prisma.Decimal(salesBreakdown.qris.totalSales),
                    debitSales: new client_1.Prisma.Decimal(salesBreakdown.debit.totalSales),
                    grabfoodSales: new client_1.Prisma.Decimal(salesBreakdown.grabfood.totalSales),
                    shopeefoodSales: new client_1.Prisma.Decimal(salesBreakdown.shopeefood.totalSales),
                    gofoodSales: new client_1.Prisma.Decimal(salesBreakdown.gofood.totalSales),
                    otherSales: new client_1.Prisma.Decimal(salesBreakdown.other.totalSales),
                    voidCount: voidSummary.totalVoidCount,
                    voidAmount: new client_1.Prisma.Decimal(voidSummary.totalVoidAmount),
                    discountAmount: new client_1.Prisma.Decimal(discountSummary.totalDiscountGiven),
                },
            });
            await tx.shift.update({
                where: { id: shift.id },
                data: {
                    xReportCount: shift.xReportCount + 1,
                    lastXReportAt: new Date(),
                },
            });
        });
        const itemsSold = shift.transactions.reduce((sum, t) => {
            return sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
        }, 0);
        return {
            reportType: 'X-REPORT',
            reportNumber,
            generatedAt: new Date(),
            shift: {
                shiftId: shift.id,
                kasirName: shift.user.name,
                startTime: shift.startTime,
                duration,
                status: shift.status,
            },
            summary: {
                totalSales: salesBreakdown.totalSales,
                totalTransactions: salesBreakdown.totalTransactions,
                averageTransaction: salesBreakdown.totalTransactions > 0
                    ? Math.round(salesBreakdown.totalSales / salesBreakdown.totalTransactions)
                    : 0,
                itemsSold,
            },
            paymentMethodBreakdown: {
                cash: {
                    totalSales: salesBreakdown.cash.totalSales,
                    transactions: salesBreakdown.cash.transactions,
                    percentage: salesBreakdown.cash.percentage,
                },
                qris: {
                    totalSales: salesBreakdown.qris.totalSales,
                    transactions: salesBreakdown.qris.transactions,
                    percentage: salesBreakdown.qris.percentage,
                },
                debit: {
                    totalSales: salesBreakdown.debit.totalSales,
                    transactions: salesBreakdown.debit.transactions,
                    percentage: salesBreakdown.debit.percentage,
                },
                grabfood: {
                    totalSales: salesBreakdown.grabfood.totalSales,
                    transactions: salesBreakdown.grabfood.transactions,
                    percentage: salesBreakdown.grabfood.percentage,
                },
                shopeefood: {
                    totalSales: salesBreakdown.shopeefood.totalSales,
                    transactions: salesBreakdown.shopeefood.transactions,
                    percentage: salesBreakdown.shopeefood.percentage,
                },
                gofood: {
                    totalSales: salesBreakdown.gofood.totalSales,
                    transactions: salesBreakdown.gofood.transactions,
                    percentage: salesBreakdown.gofood.percentage,
                },
                other: {
                    totalSales: salesBreakdown.other.totalSales,
                    transactions: salesBreakdown.other.transactions,
                    percentage: salesBreakdown.other.percentage,
                },
            },
            voidSummary,
            discountSummary,
            topProducts,
            cashReconciliation: {
                initialCash: Number(shift.initialCash),
                cashSales: salesBreakdown.cash.totalSales,
                expectedCash: Number(shift.initialCash) + salesBreakdown.cash.totalSales,
                note: 'Shift belum ditutup, belum ada final count',
            },
        };
    }
    async getZReport(shiftId, userId, businessId) {
        const shift = await this.prisma.shift.findFirst({
            where: {
                id: shiftId,
                businessId,
                status: 'CLOSED',
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                transactions: {
                    where: {
                        status: 'COMPLETED',
                    },
                    include: {
                        items: true,
                    },
                },
            },
        });
        if (!shift) {
            throw new common_1.NotFoundException('Shift tidak ditemukan atau belum ditutup');
        }
        const validTransactions = shift.transactions.filter((t) => !t.isVoid);
        const voidTransactions = shift.transactions.filter((t) => t.isVoid);
        const salesBreakdown = this.calculateSalesBreakdown(validTransactions);
        const reportNumber = `Z-${shift.startTime.toISOString().split('T')[0].replace(/-/g, '')}-${shift.user.name.toUpperCase()}-001`;
        const durationMs = shift.endTime
            ? shift.endTime.getTime() - shift.startTime.getTime()
            : 0;
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const duration = `${hours} hours`;
        const voidSummary = {
            totalVoidCount: voidTransactions.length,
            totalVoidAmount: voidTransactions.reduce((sum, t) => sum + Number(t.totalAmount), 0),
            voidTransactions: voidTransactions.map((t) => ({
                transactionNumber: t.transactionNumber,
                amount: Number(t.totalAmount),
                reason: t.voidReason || 'No reason provided',
                voidedAt: t.voidedAt || new Date(),
            })),
        };
        const discountTransactions = validTransactions.filter((t) => Number(t.discountAmount || 0) > 0);
        const discountSummary = {
            totalDiscountGiven: validTransactions.reduce((sum, t) => sum + Number(t.discountAmount || 0), 0),
            discountCount: discountTransactions.length,
            averageDiscount: discountTransactions.length > 0
                ? validTransactions.reduce((sum, t) => sum + Number(t.discountAmount || 0), 0) / discountTransactions.length
                : 0,
        };
        const productMap = new Map();
        validTransactions.forEach((t) => {
            t.items.forEach((item) => {
                const existing = productMap.get(item.productName);
                const itemCost = Number(item.costPrice || 0) * item.quantity;
                if (existing) {
                    existing.qty += item.quantity;
                    existing.revenue += Number(item.subtotal);
                    existing.cost += itemCost;
                }
                else {
                    productMap.set(item.productName, {
                        name: item.productName,
                        qty: item.quantity,
                        revenue: Number(item.subtotal),
                        cost: itemCost,
                    });
                }
            });
        });
        const topProducts = Array.from(productMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((p) => ({
            productName: p.name,
            quantitySold: p.qty,
            revenue: p.revenue,
            profitMargin: p.revenue > 0
                ? Math.round(((p.revenue - p.cost) / p.revenue) * 100 * 10) / 10
                : 0,
        }));
        const itemsSold = validTransactions.reduce((sum, t) => {
            return sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
        }, 0);
        const cashDiff = Number(shift.cashDifference || 0);
        let cashStatus = 'PERFECT_MATCH';
        if (cashDiff < 0)
            cashStatus = 'SHORT';
        if (cashDiff > 0)
            cashStatus = 'OVER';
        const buildReconciliation = (method, sales, settlement) => {
            const diff = settlement !== null ? settlement - sales : 0;
            let status = 'NOT_VERIFIED';
            if (settlement !== null) {
                if (diff === 0)
                    status = 'MATCHED';
                else if (diff < 0)
                    status = 'SHORT';
                else
                    status = 'OVER';
            }
            return {
                expected: sales,
                settlement,
                difference: diff,
                status,
            };
        };
        return {
            reportType: 'Z-REPORT',
            reportNumber,
            generatedAt: new Date(),
            shift: {
                shiftId: shift.id,
                kasirName: shift.user.name,
                startTime: shift.startTime,
                endTime: shift.endTime || new Date(),
                duration,
                status: shift.status,
            },
            salesSummary: {
                totalSales: salesBreakdown.totalSales,
                totalTransactions: salesBreakdown.totalTransactions,
                averageTransaction: salesBreakdown.totalTransactions > 0
                    ? Math.round(salesBreakdown.totalSales / salesBreakdown.totalTransactions)
                    : 0,
                itemsSold,
            },
            paymentMethodBreakdown: {
                cash: {
                    totalSales: salesBreakdown.cash.totalSales,
                    transactions: salesBreakdown.cash.transactions,
                    percentage: salesBreakdown.cash.percentage,
                    reconciliation: buildReconciliation('cash', salesBreakdown.cash.totalSales, Number(shift.finalCash || 0) - Number(shift.initialCash)),
                },
                qris: {
                    totalSales: salesBreakdown.qris.totalSales,
                    transactions: salesBreakdown.qris.transactions,
                    percentage: salesBreakdown.qris.percentage,
                    reconciliation: buildReconciliation('qris', salesBreakdown.qris.totalSales, null),
                },
                debit: {
                    totalSales: salesBreakdown.debit.totalSales,
                    transactions: salesBreakdown.debit.transactions,
                    percentage: salesBreakdown.debit.percentage,
                    reconciliation: buildReconciliation('debit', salesBreakdown.debit.totalSales, null),
                },
                grabfood: {
                    totalSales: salesBreakdown.grabfood.totalSales,
                    transactions: salesBreakdown.grabfood.transactions,
                    percentage: salesBreakdown.grabfood.percentage,
                    reconciliation: buildReconciliation('grabfood', salesBreakdown.grabfood.totalSales, null),
                },
                shopeefood: {
                    totalSales: salesBreakdown.shopeefood.totalSales,
                    transactions: salesBreakdown.shopeefood.transactions,
                    percentage: salesBreakdown.shopeefood.percentage,
                    reconciliation: buildReconciliation('shopeefood', salesBreakdown.shopeefood.totalSales, null),
                },
                gofood: {
                    totalSales: salesBreakdown.gofood.totalSales,
                    transactions: salesBreakdown.gofood.transactions,
                    percentage: salesBreakdown.gofood.percentage,
                    reconciliation: buildReconciliation('gofood', salesBreakdown.gofood.totalSales, null),
                },
                other: {
                    totalSales: salesBreakdown.other.totalSales,
                    transactions: salesBreakdown.other.transactions,
                    percentage: salesBreakdown.other.percentage,
                    reconciliation: buildReconciliation('other', salesBreakdown.other.totalSales, null),
                },
            },
            cashReconciliation: {
                initialCash: Number(shift.initialCash),
                cashSales: salesBreakdown.cash.totalSales,
                expectedCash: Number(shift.expectedCash),
                finalCash: Number(shift.finalCash || 0),
                cashDifference: cashDiff,
                status: cashStatus,
            },
            voidSummary,
            discountSummary,
            topProducts,
            xReportHistory: {
                totalXReports: shift.xReportCount,
                lastXReportAt: shift.lastXReportAt,
            },
            notes: {
                shiftNotes: shift.notes,
                technicalIssues: shift.technicalIssues,
                inventoryNotes: shift.inventoryNotes,
            },
        };
    }
    async preCloseShift(userId, businessId, dto) {
        const shift = await this.prisma.shift.findFirst({
            where: {
                userId,
                businessId,
                status: 'OPEN',
            },
            include: {
                transactions: {
                    where: {
                        status: 'COMPLETED',
                        isVoid: false,
                    },
                },
            },
        });
        if (!shift) {
            throw new common_1.NotFoundException('Tidak ada shift aktif. Mulai shift terlebih dahulu.');
        }
        const voidTransactions = await this.prisma.transaction.findMany({
            where: {
                shiftId: shift.id,
                isVoid: true,
            },
        });
        const totalVoidCount = voidTransactions.length;
        const totalVoidAmount = voidTransactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
        const totalDiscountAmount = shift.transactions.reduce((sum, t) => sum + Number(t.discountAmount || 0), 0);
        const cashTransactions = shift.transactions.filter((t) => t.paymentMethod === 'CASH');
        const expectedCashFromSales = cashTransactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
        const expectedCash = Number(shift.initialCash) + expectedCashFromSales;
        const finalCash = dto.finalCash;
        const cashDifference = finalCash - expectedCash;
        let reconciliationStatus = 'MATCHED';
        const warnings = [];
        if (cashDifference < 0) {
            reconciliationStatus = 'SHORT';
            warnings.push(`Cash kurang Rp ${Math.abs(cashDifference).toLocaleString('id-ID')}. Mohon cek kembali atau catat di notes.`);
        }
        else if (cashDifference > 0) {
            reconciliationStatus = 'OVER';
            warnings.push(`Cash lebih Rp ${cashDifference.toLocaleString('id-ID')}. Mohon cek kembali atau catat di notes.`);
        }
        await this.prisma.shift.update({
            where: {
                id: shift.id,
            },
            data: {
                endTime: new Date(),
                status: 'CLOSED',
                finalCash: new client_1.Prisma.Decimal(finalCash),
                expectedCash: new client_1.Prisma.Decimal(expectedCash),
                cashDifference: new client_1.Prisma.Decimal(cashDifference),
                notes: dto.notes,
                technicalIssues: dto.technicalIssues,
                inventoryNotes: dto.inventoryNotes,
                totalVoidCount,
                totalVoidAmount: new client_1.Prisma.Decimal(totalVoidAmount),
                totalDiscountAmount: new client_1.Prisma.Decimal(totalDiscountAmount),
            },
        });
        return {
            shiftId: shift.id,
            status: 'CLOSED',
            previewZReport: {
                cashDifference,
                reconciliationStatus,
                warnings,
            },
            message: 'Shift berhasil ditutup. Z-Report tersedia.',
        };
    }
    calculateSalesBreakdown(transactions) {
        const breakdown = {
            cash: { totalSales: 0, transactions: 0, percentage: 0 },
            qris: { totalSales: 0, transactions: 0, percentage: 0 },
            debit: { totalSales: 0, transactions: 0, percentage: 0 },
            grabfood: { totalSales: 0, transactions: 0, percentage: 0 },
            shopeefood: { totalSales: 0, transactions: 0, percentage: 0 },
            gofood: { totalSales: 0, transactions: 0, percentage: 0 },
            other: { totalSales: 0, transactions: 0, percentage: 0 },
            totalSales: 0,
            totalTransactions: transactions.length,
        };
        transactions.forEach((t) => {
            const amount = Number(t.totalAmount);
            const method = (t.paymentMethod?.toLowerCase() || 'other');
            breakdown.totalSales += amount;
            if (breakdown[method] && typeof breakdown[method] === 'object') {
                breakdown[method].totalSales += amount;
                breakdown[method].transactions += 1;
            }
            else {
                breakdown.other.totalSales += amount;
                breakdown.other.transactions += 1;
            }
        });
        Object.keys(breakdown).forEach((key) => {
            if (key !== 'totalSales' && key !== 'totalTransactions') {
                const method = breakdown[key];
                if (method && typeof method === 'object') {
                    method.percentage =
                        breakdown.totalSales > 0
                            ? Math.round((method.totalSales / breakdown.totalSales) * 100 * 10) / 10
                            : 0;
                }
            }
        });
        return breakdown;
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map
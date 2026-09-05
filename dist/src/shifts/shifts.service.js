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
        const cashTransactions = shift.transactions.filter((t) => t.paymentMethod === 'CASH');
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
        const totalCashToDeposit = initialCash + salesByPaymentMethod.cash.expectedCashFromSales;
        const actualCashInHand = shift.finalCash ? Number(shift.finalCash) : null;
        return {
            shiftId: shift.id,
            kasirName: shift.user.name,
            startTime: shift.startTime,
            endTime: shift.endTime,
            status: shift.status,
            initialCash,
            finalCash: actualCashInHand,
            expectedCash: Number(shift.expectedCash),
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
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map
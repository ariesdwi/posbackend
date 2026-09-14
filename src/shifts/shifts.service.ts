import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  StartShiftDto,
  EndShiftDto,
  ShiftReportResponseDto,
  GetCurrentShiftResponseDto,
} from './dto/shift.dto';
import {
  XReportResponseDto,
  ZReportResponseDto,
  PreCloseShiftDto,
  PreCloseShiftResponseDto,
} from './dto/phase1.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  async startShift(
    userId: string,
    businessId: string,
    dto: StartShiftDto,
  ): Promise<ShiftReportResponseDto> {
    // Check if user already has an open shift
    const existingOpenShift = await this.prisma.shift.findFirst({
      where: {
        userId,
        businessId,
        status: 'OPEN',
      },
    });

    if (existingOpenShift) {
      throw new BadRequestException(
        'Anda sudah memiliki shift yang sedang aktif. Selesaikan shift sebelumnya terlebih dahulu.',
      );
    }

    // Create new shift
    const shift = await this.prisma.shift.create({
      data: {
        initialCash: new Prisma.Decimal(dto.initialCash || 0),
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

    // Return shift report (empty sales at start)
    return this.buildShiftReport(shift, []);
  }

  async endShift(
    userId: string,
    businessId: string,
    dto: EndShiftDto,
  ): Promise<ShiftReportResponseDto> {
    // Find open shift
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
      throw new NotFoundException(
        'Tidak ada shift aktif. Mulai shift terlebih dahulu.',
      );
    }

    // Calculate void & discount totals
    const voidTransactions = shift.transactions.filter((t) => t.isVoid);
    const totalVoidCount = voidTransactions.length;
    const totalVoidAmount = voidTransactions.reduce(
      (sum, t) => sum + Number(t.totalAmount),
      0,
    );

    const totalDiscountAmount = shift.transactions.reduce(
      (sum, t) => sum + Number(t.discountAmount || 0),
      0,
    );

    // Calculate expected cash from CASH transactions (non-void)
    const cashTransactions = shift.transactions.filter(
      (t) => t.paymentMethod === 'CASH' && !t.isVoid,
    );
    const expectedCashFromSales = cashTransactions.reduce(
      (sum, t) => sum + Number(t.totalAmount),
      0,
    );

    const expectedCash = Number(shift.initialCash) + expectedCashFromSales;
    const finalCash = dto.finalCash;
    const cashDifference = finalCash - expectedCash;

    // Update shift with all calculated data
    const updatedShift = await this.prisma.shift.update({
      where: {
        id: shift.id,
      },
      data: {
        endTime: new Date(),
        status: 'CLOSED',
        finalCash: new Prisma.Decimal(finalCash),
        expectedCash: new Prisma.Decimal(expectedCash),
        cashDifference: new Prisma.Decimal(cashDifference),
        notes: dto.notes,
        totalVoidCount,
        totalVoidAmount: new Prisma.Decimal(totalVoidAmount),
        totalDiscountAmount: new Prisma.Decimal(totalDiscountAmount),
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

  async getCurrentShift(
    userId: string,
    businessId: string,
  ): Promise<GetCurrentShiftResponseDto> {
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

  async getShiftById(
    shiftId: string,
    userId: string,
    businessId: string,
  ): Promise<ShiftReportResponseDto> {
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
      throw new NotFoundException('Shift tidak ditemukan');
    }

    return this.buildShiftReport(shift, shift.transactions);
  }

  private buildShiftReport(shift: any, transactions: any[]): ShiftReportResponseDto {
    // Initialize sales breakdown
    const salesByPaymentMethod = {
      cash: { totalSales: 0, totalTransactions: 0, expectedCashFromSales: 0 },
      qris: { totalSales: 0, totalTransactions: 0 },
      debit: { totalSales: 0, totalTransactions: 0 },
      grabfood: { totalSales: 0, totalTransactions: 0 },
      shopeefood: { totalSales: 0, totalTransactions: 0 },
      gofood: { totalSales: 0, totalTransactions: 0 },
      other: { totalSales: 0, totalTransactions: 0 },
    };

    // Calculate sales by payment method
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

    // Calculate summary
    const totalSales = transactions.reduce(
      (sum, t) => sum + Number(t.totalAmount),
      0,
    );
    const totalTransactions = transactions.length;
    const initialCash = Number(shift.initialCash);
    const totalCashToDeposit =
      initialCash + salesByPaymentMethod.cash.expectedCashFromSales;
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

  // ============ PHASE 1: X-REPORT & Z-REPORT METHODS ============

  /**
   * Generate X-Report (laporan sementara tanpa tutup shift)
   */
  async getXReport(
    userId: string,
    businessId: string,
  ): Promise<XReportResponseDto> {
    // Get current open shift
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
            isVoid: false, // Exclude voided transactions
          },
          include: {
            items: true,
          },
        },
      },
    });

    if (!shift) {
      throw new NotFoundException(
        'Tidak ada shift aktif. Mulai shift terlebih dahulu.',
      );
    }

    // Generate report number
    const reportNumber = `X-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(shift.xReportCount + 1).padStart(3, '0')}`;

    // Calculate sales breakdown
    const salesBreakdown = this.calculateSalesBreakdown(shift.transactions);
    
    // Calculate void & discount summary
    const voidTransactions = await this.prisma.transaction.findMany({
      where: {
        shiftId: shift.id,
        isVoid: true,
      },
    });
    
    const voidSummary = {
      totalVoidCount: voidTransactions.length,
      totalVoidAmount: voidTransactions.reduce(
        (sum, t) => sum + Number(t.totalAmount),
        0,
      ),
    };

    const discountSummary = {
      totalDiscountGiven: shift.transactions.reduce(
        (sum, t) => sum + Number(t.discountAmount || 0),
        0,
      ),
      averageDiscount:
        shift.transactions.length > 0
          ? shift.transactions.reduce(
              (sum, t) => sum + Number(t.discountAmount || 0),
              0,
            ) / shift.transactions.length
          : 0,
    };

    // Get top products
    const productMap = new Map<string, { name: string; qty: number; revenue: number }>();
    shift.transactions.forEach((t) => {
      t.items.forEach((item: any) => {
        const existing = productMap.get(item.productName);
        if (existing) {
          existing.qty += item.quantity;
          existing.revenue += Number(item.subtotal);
        } else {
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

    // Calculate duration
    const durationMs = Date.now() - shift.startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = `${hours} hours ${minutes} minutes`;

    // Save X-Report snapshot to database
    await this.prisma.xReport.create({
      data: {
        shiftId: shift.id,
        reportNumber,
        generatedBy: userId,
        totalSales: new Prisma.Decimal(salesBreakdown.totalSales),
        totalTransactions: salesBreakdown.totalTransactions,
        cashSales: new Prisma.Decimal(salesBreakdown.cash.totalSales),
        qrisSales: new Prisma.Decimal(salesBreakdown.qris.totalSales),
        debitSales: new Prisma.Decimal(salesBreakdown.debit.totalSales),
        grabfoodSales: new Prisma.Decimal(salesBreakdown.grabfood.totalSales),
        shopeefoodSales: new Prisma.Decimal(salesBreakdown.shopeefood.totalSales),
        gofoodSales: new Prisma.Decimal(salesBreakdown.gofood.totalSales),
        otherSales: new Prisma.Decimal(salesBreakdown.other.totalSales),
        voidCount: voidSummary.totalVoidCount,
        voidAmount: new Prisma.Decimal(voidSummary.totalVoidAmount),
        discountAmount: new Prisma.Decimal(discountSummary.totalDiscountGiven),
      },
    });

    // Update shift X-Report count
    await this.prisma.shift.update({
      where: { id: shift.id },
      data: {
        xReportCount: shift.xReportCount + 1,
        lastXReportAt: new Date(),
      },
    });

    // Calculate items sold
    const itemsSold = shift.transactions.reduce((sum, t) => {
      return sum + t.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0);
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
        averageTransaction:
          salesBreakdown.totalTransactions > 0
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

  /**
   * Get Z-Report (final report setelah shift ditutup)
   */
  async getZReport(
    shiftId: string,
    userId: string,
    businessId: string,
  ): Promise<ZReportResponseDto> {
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
      throw new NotFoundException(
        'Shift tidak ditemukan atau belum ditutup',
      );
    }

    // Filter non-void transactions for sales calculation
    const validTransactions = shift.transactions.filter((t) => !t.isVoid);
    const voidTransactions = shift.transactions.filter((t) => t.isVoid);

    // Calculate sales breakdown
    const salesBreakdown = this.calculateSalesBreakdown(validTransactions);

    // Generate Z-Report number
    const reportNumber = `Z-${shift.startTime.toISOString().split('T')[0].replace(/-/g, '')}-${shift.user.name.toUpperCase()}-001`;

    // Calculate duration
    const durationMs = shift.endTime
      ? shift.endTime.getTime() - shift.startTime.getTime()
      : 0;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = `${hours} hours`;

    // Void summary with details
    const voidSummary = {
      totalVoidCount: voidTransactions.length,
      totalVoidAmount: voidTransactions.reduce(
        (sum, t) => sum + Number(t.totalAmount),
        0,
      ),
      voidTransactions: voidTransactions.map((t) => ({
        transactionNumber: t.transactionNumber,
        amount: Number(t.totalAmount),
        reason: t.voidReason || 'No reason provided',
        voidedAt: t.voidedAt || new Date(),
      })),
    };

    // Discount summary
    const discountTransactions = validTransactions.filter(
      (t) => Number(t.discountAmount || 0) > 0,
    );
    const discountSummary = {
      totalDiscountGiven: validTransactions.reduce(
        (sum, t) => sum + Number(t.discountAmount || 0),
        0,
      ),
      discountCount: discountTransactions.length,
      averageDiscount:
        discountTransactions.length > 0
          ? validTransactions.reduce(
              (sum, t) => sum + Number(t.discountAmount || 0),
              0,
            ) / discountTransactions.length
          : 0,
    };

    // Top products with profit margin
    const productMap = new Map<
      string,
      { name: string; qty: number; revenue: number; cost: number }
    >();
    validTransactions.forEach((t) => {
      t.items.forEach((item: any) => {
        const existing = productMap.get(item.productName);
        const itemCost = Number(item.costPrice || 0) * item.quantity;
        if (existing) {
          existing.qty += item.quantity;
          existing.revenue += Number(item.subtotal);
          existing.cost += itemCost;
        } else {
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
        profitMargin:
          p.revenue > 0
            ? Math.round(((p.revenue - p.cost) / p.revenue) * 100 * 10) / 10
            : 0,
      }));

    // Items sold
    const itemsSold = validTransactions.reduce((sum, t) => {
      return sum + t.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0);
    }, 0);

    // Cash reconciliation status
    const cashDiff = Number(shift.cashDifference || 0);
    let cashStatus: 'PERFECT_MATCH' | 'SHORT' | 'OVER' = 'PERFECT_MATCH';
    if (cashDiff < 0) cashStatus = 'SHORT';
    if (cashDiff > 0) cashStatus = 'OVER';

    // Payment method reconciliation (expanded with status)
    const buildReconciliation = (
      method: string,
      sales: number,
      settlement: number | null,
    ) => {
      const diff = settlement !== null ? settlement - sales : 0;
      let status: 'MATCHED' | 'SHORT' | 'OVER' | 'NOT_VERIFIED' = 'NOT_VERIFIED';
      
      if (settlement !== null) {
        if (diff === 0) status = 'MATCHED';
        else if (diff < 0) status = 'SHORT';
        else status = 'OVER';
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
        averageTransaction:
          salesBreakdown.totalTransactions > 0
            ? Math.round(salesBreakdown.totalSales / salesBreakdown.totalTransactions)
            : 0,
        itemsSold,
      },
      paymentMethodBreakdown: {
        cash: {
          totalSales: salesBreakdown.cash.totalSales,
          transactions: salesBreakdown.cash.transactions,
          percentage: salesBreakdown.cash.percentage,
          reconciliation: buildReconciliation(
            'cash',
            salesBreakdown.cash.totalSales,
            Number(shift.finalCash || 0) - Number(shift.initialCash),
          ),
        },
        qris: {
          totalSales: salesBreakdown.qris.totalSales,
          transactions: salesBreakdown.qris.transactions,
          percentage: salesBreakdown.qris.percentage,
          reconciliation: buildReconciliation(
            'qris',
            salesBreakdown.qris.totalSales,
            null,
          ),
        },
        debit: {
          totalSales: salesBreakdown.debit.totalSales,
          transactions: salesBreakdown.debit.transactions,
          percentage: salesBreakdown.debit.percentage,
          reconciliation: buildReconciliation(
            'debit',
            salesBreakdown.debit.totalSales,
            null,
          ),
        },
        grabfood: {
          totalSales: salesBreakdown.grabfood.totalSales,
          transactions: salesBreakdown.grabfood.transactions,
          percentage: salesBreakdown.grabfood.percentage,
          reconciliation: buildReconciliation(
            'grabfood',
            salesBreakdown.grabfood.totalSales,
            null,
          ),
        },
        shopeefood: {
          totalSales: salesBreakdown.shopeefood.totalSales,
          transactions: salesBreakdown.shopeefood.transactions,
          percentage: salesBreakdown.shopeefood.percentage,
          reconciliation: buildReconciliation(
            'shopeefood',
            salesBreakdown.shopeefood.totalSales,
            null,
          ),
        },
        gofood: {
          totalSales: salesBreakdown.gofood.totalSales,
          transactions: salesBreakdown.gofood.transactions,
          percentage: salesBreakdown.gofood.percentage,
          reconciliation: buildReconciliation(
            'gofood',
            salesBreakdown.gofood.totalSales,
            null,
          ),
        },
        other: {
          totalSales: salesBreakdown.other.totalSales,
          transactions: salesBreakdown.other.transactions,
          percentage: salesBreakdown.other.percentage,
          reconciliation: buildReconciliation(
            'other',
            salesBreakdown.other.totalSales,
            null,
          ),
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

  /**
   * Pre-close shift (validate & prepare for closure)
   */
  async preCloseShift(
    userId: string,
    businessId: string,
    dto: PreCloseShiftDto,
  ): Promise<PreCloseShiftResponseDto> {
    // Find open shift
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
      throw new NotFoundException(
        'Tidak ada shift aktif. Mulai shift terlebih dahulu.',
      );
    }

    // Calculate void & discount totals
    const voidTransactions = await this.prisma.transaction.findMany({
      where: {
        shiftId: shift.id,
        isVoid: true,
      },
    });

    const totalVoidCount = voidTransactions.length;
    const totalVoidAmount = voidTransactions.reduce(
      (sum, t) => sum + Number(t.totalAmount),
      0,
    );

    const totalDiscountAmount = shift.transactions.reduce(
      (sum, t) => sum + Number(t.discountAmount || 0),
      0,
    );

    // Calculate expected cash
    const cashTransactions = shift.transactions.filter(
      (t) => t.paymentMethod === 'CASH',
    );
    const expectedCashFromSales = cashTransactions.reduce(
      (sum, t) => sum + Number(t.totalAmount),
      0,
    );

    const expectedCash = Number(shift.initialCash) + expectedCashFromSales;
    const finalCash = dto.finalCash;
    const cashDifference = finalCash - expectedCash;

    // Determine status & warnings
    let reconciliationStatus: 'MATCHED' | 'SHORT' | 'OVER' = 'MATCHED';
    const warnings: string[] = [];

    if (cashDifference < 0) {
      reconciliationStatus = 'SHORT';
      warnings.push(
        `Cash kurang Rp ${Math.abs(cashDifference).toLocaleString('id-ID')}. Mohon cek kembali atau catat di notes.`,
      );
    } else if (cashDifference > 0) {
      reconciliationStatus = 'OVER';
      warnings.push(
        `Cash lebih Rp ${cashDifference.toLocaleString('id-ID')}. Mohon cek kembali atau catat di notes.`,
      );
    }

    // Close shift with all calculated data
    await this.prisma.shift.update({
      where: {
        id: shift.id,
      },
      data: {
        endTime: new Date(),
        status: 'CLOSED',
        finalCash: new Prisma.Decimal(finalCash),
        expectedCash: new Prisma.Decimal(expectedCash),
        cashDifference: new Prisma.Decimal(cashDifference),
        notes: dto.notes,
        technicalIssues: dto.technicalIssues,
        inventoryNotes: dto.inventoryNotes,
        totalVoidCount,
        totalVoidAmount: new Prisma.Decimal(totalVoidAmount),
        totalDiscountAmount: new Prisma.Decimal(totalDiscountAmount),
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

  /**
   * Helper: Calculate sales breakdown by payment method
   */
  private calculateSalesBreakdown(transactions: any[]) {
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
      const method = (t.paymentMethod?.toLowerCase() || 'other') as keyof typeof breakdown;

      breakdown.totalSales += amount;

      if (breakdown[method] && typeof breakdown[method] === 'object') {
        (breakdown[method] as any).totalSales += amount;
        (breakdown[method] as any).transactions += 1;
      } else {
        breakdown.other.totalSales += amount;
        breakdown.other.transactions += 1;
      }
    });

    // Calculate percentages
    Object.keys(breakdown).forEach((key) => {
      if (key !== 'totalSales' && key !== 'totalTransactions') {
        const method = breakdown[key as keyof typeof breakdown] as any;
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
}

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

    // Calculate expected cash from CASH transactions
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

    // Update shift
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
}

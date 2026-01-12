import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
  CheckoutDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import { Prisma, ProductStatus, TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
    businessId: string,
  ) {
    const { items, tableNumber, paymentMethod, paymentAmount, notes, status } =
      createTransactionDto;

    // Validate products and check stock, ensuring they belong to the same business
    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        businessId, // Scope by business
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    // Check if there's an existing PENDING transaction for this table
    let existingTransaction: any = null;
    if (tableNumber) {
      existingTransaction = await this.prisma.transaction.findFirst({
        where: {
          tableNumber,
          status: TransactionStatus.PENDING,
          businessId, // Scope by business
        } as any,
        include: { items: true },
      });
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      if (product.status === ProductStatus.OUT_OF_STOCK) {
        throw new BadRequestException(
          `Product ${product.name} is out of stock`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }
    }

    // Calculate items data
    let additionalAmount = 0;
    const transactionItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(`Product not found: ${item.productId}`);
      }
      const price = Number(product.price);
      const subtotal = price * item.quantity;
      additionalAmount += subtotal;

      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: new Prisma.Decimal(price),
        subtotal: new Prisma.Decimal(subtotal),
      };
    });

    if (existingTransaction) {
      // APPEND to existing transaction
      const newTotalAmount =
        Number(existingTransaction.totalAmount) + additionalAmount;

      return this.prisma.$transaction(async (tx) => {
        // Update transaction total
        const updatedTransaction = await tx.transaction.update({
          where: { id: existingTransaction.id },
          data: {
            totalAmount: new Prisma.Decimal(newTotalAmount),
            notes: notes || existingTransaction.notes,
            items: {
              create: transactionItems,
            },
          },
          include: {
            items: { include: { product: true } },
            user: { select: { id: true, name: true, email: true } },
          },
        });

        // Update stock
        for (const item of items) {
          const product = products.find((p) => p.id === item.productId);
          if (!product) continue;
          const newStock = product.stock - item.quantity;
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: newStock,
              status:
                newStock > 0
                  ? ProductStatus.AVAILABLE
                  : ProductStatus.OUT_OF_STOCK,
            },
          });
        }

        return updatedTransaction;
      });
    }

    // CREATE NEW transaction
    const totalAmount = additionalAmount;
    const finalStatus = status || TransactionStatus.PENDING;

    // Calculate change (only if completed)
    const changeAmount =
      finalStatus === TransactionStatus.COMPLETED &&
      paymentAmount &&
      paymentAmount >= totalAmount
        ? paymentAmount - totalAmount
        : 0;

    // Generate transaction number
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const count = await this.prisma.transaction.count({
      where: {
        businessId, // Scope count by business
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lt: new Date(today.setHours(23, 59, 59, 999)),
        },
      },
    });
    const transactionNumber = `TRX-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    return this.prisma.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          transactionNumber,
          userId,
          businessId, // Link to business
          tableNumber,
          totalAmount: new Prisma.Decimal(totalAmount),
          paymentMethod: paymentMethod || undefined,
          paymentAmount: paymentAmount
            ? new Prisma.Decimal(paymentAmount)
            : null,
          changeAmount: new Prisma.Decimal(changeAmount),
          status: finalStatus,
          notes,
          items: {
            create: transactionItems,
          },
        } as any,
        include: {
          items: { include: { product: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      // Update stock
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) continue;
        const newStock = product.stock - item.quantity;
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: newStock,
            status:
              newStock > 0
                ? ProductStatus.AVAILABLE
                : ProductStatus.OUT_OF_STOCK,
          },
        });
      }

      return newTransaction;
    });
  }

  async checkout(id: string, checkoutDto: CheckoutDto, businessId: string) {
    const transaction = await this.findOne(id, businessId);

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException(
        'Transaction is already completed or cancelled',
      );
    }

    const totalAmount = Number(transaction.totalAmount);
    if (checkoutDto.paymentAmount < totalAmount) {
      throw new BadRequestException(
        `Insufficient payment. Total: ${totalAmount}, Provided: ${checkoutDto.paymentAmount}`,
      );
    }

    const changeAmount = checkoutDto.paymentAmount - totalAmount;

    return this.prisma.transaction.update({
      where: { id },
      data: {
        paymentMethod: checkoutDto.paymentMethod,
        paymentAmount: new Prisma.Decimal(checkoutDto.paymentAmount),
        changeAmount: new Prisma.Decimal(changeAmount),
        status: TransactionStatus.COMPLETED,
        notes: checkoutDto.notes || transaction.notes,
      },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findAll(
    businessId: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    userId?: string,
    tableNumber?: string,
  ) {
    const where: any = { businessId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    if (tableNumber) {
      where.tableNumber = tableNumber;
    }

    return this.prisma.transaction.findMany({
      where: where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, businessId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, businessId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateTransactionStatusDto,
    businessId: string,
  ) {
    await this.findOne(id, businessId);

    return this.prisma.transaction.update({
      where: { id },
      data: { status: updateStatusDto.status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    updateDto: UpdateTransactionDto,
    businessId: string,
  ) {
    // Verify transaction exists and belongs to business
    const transaction = await this.findOne(id, businessId);

    // Only allow updating PENDING transactions
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException(
        'Only PENDING transactions can be updated. This transaction is already completed or cancelled.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Delete existing transaction items
      await tx.transactionItem.deleteMany({
        where: { transactionId: id },
      });

      // Create new transaction items from DTO
      const transactionItems = updateDto.items.map((item) => ({
        productId: item.productId || null,
        productName: item.productName,
        quantity: item.quantity,
        price: new Prisma.Decimal(item.price),
        subtotal: new Prisma.Decimal(item.subtotal),
      }));

      // Update transaction with new items and totals
      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: {
          totalAmount: new Prisma.Decimal(updateDto.total),
          items: {
            create: transactionItems,
          },
        },
        include: {
          items: { include: { product: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      return updatedTransaction;
    });
  }
}

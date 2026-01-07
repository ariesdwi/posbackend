import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
} from './dto/transaction.dto';
import { Prisma, ProductStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const { items, paymentMethod, paymentAmount, notes } = createTransactionDto;

    // Validate products and check stock
    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      if (product.status === ProductStatus.OUT_OF_STOCK) {
        throw new BadRequestException(`Product ${product.name} is out of stock`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    const transactionItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(`Product not found: ${item.productId}`);
      }
      const price = Number(product.price);
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: new Prisma.Decimal(price),
        subtotal: new Prisma.Decimal(subtotal),
      };
    });

    // Calculate change
    const changeAmount =
      paymentAmount && paymentAmount >= totalAmount
        ? paymentAmount - totalAmount
        : 0;

    // Generate transaction number
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const count = await this.prisma.transaction.count({
      where: {
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lt: new Date(today.setHours(23, 59, 59, 999)),
        },
      },
    });
    const transactionNumber = `TRX-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    // Create transaction with items and update stock
    const transaction = await this.prisma.$transaction(async (tx) => {
      // Create transaction
      const newTransaction = await tx.transaction.create({
        data: {
          transactionNumber,
          userId,
          totalAmount: new Prisma.Decimal(totalAmount),
          paymentMethod,
          paymentAmount: paymentAmount
            ? new Prisma.Decimal(paymentAmount)
            : null,
          changeAmount: new Prisma.Decimal(changeAmount),
          notes,
          items: {
            create: transactionItems,
          },
        },
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

      // Update stock for each product
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) continue;
        
        const newStock = product.stock - item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: newStock,
            status:
              newStock > 0 ? ProductStatus.AVAILABLE : ProductStatus.OUT_OF_STOCK,
          },
        });
      }

      return newTransaction;
    });

    return transaction;
  }

  async findAll(
    startDate?: string,
    endDate?: string,
    status?: string,
    userId?: string,
  ) {
    const where: any = {};

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

    return this.prisma.transaction.findMany({
      where,
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

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
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

  async updateStatus(id: string, updateStatusDto: UpdateTransactionStatusDto) {
    await this.findOne(id);

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
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async create(createBusinessDto: CreateBusinessDto) {
    const business = await this.prisma.business.create({
      data: createBusinessDto,
    });

    return business;
  }

  async findAll() {
    const businesses = await this.prisma.business.findMany({
      include: {
        _count: {
          select: {
            users: true,
            products: true,
            categories: true,
            transactions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return businesses;
  }

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            products: true,
            categories: true,
            transactions: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    const updated = await this.prisma.business.update({
      where: { id },
      data: updateBusinessDto,
    });

    return updated;
  }

  async remove(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    // This will cascade delete all related users, products, categories, and transactions
    await this.prisma.business.delete({
      where: { id },
    });

    return { message: 'Business deleted successfully', id };
  }

  async getStats(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    const [userCount, productCount, categoryCount, transactionCount] =
      await Promise.all([
        this.prisma.user.count({ where: { businessId: id } }),
        this.prisma.product.count({ where: { businessId: id } }),
        this.prisma.category.count({ where: { businessId: id } }),
        this.prisma.transaction.count({ where: { businessId: id } }),
      ]);

    // Get total revenue
    const transactions = await this.prisma.transaction.findMany({
      where: {
        businessId: id,
        status: 'COMPLETED',
      },
      select: {
        totalAmount: true,
      },
    });

    const totalRevenue = transactions.reduce(
      (sum, t) => sum + Number(t.totalAmount),
      0,
    );

    return {
      business,
      stats: {
        users: userCount,
        products: productCount,
        categories: categoryCount,
        transactions: transactionCount,
        totalRevenue,
      },
    };
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, businessId: string) {
    const existing = await this.prisma.category.findFirst({
      where: { name: createCategoryDto.name, businessId },
    });

    if (existing) {
      throw new ConflictException('Category name already exists');
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        businessId,
      },
    });
  }

  async findAll(businessId: string) {
    return this.prisma.category.findMany({
      where: { businessId },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findOne(id: string, businessId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, businessId },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    businessId: string,
  ) {
    await this.findOne(id, businessId);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string, businessId: string) {
    await this.findOne(id, businessId);

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }
}

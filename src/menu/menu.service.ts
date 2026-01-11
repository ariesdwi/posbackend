import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateStockDto,
} from './dto/product.dto';
import { ProductStatus } from '@prisma/client';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    businessId: string,
    file?: Express.Multer.File,
  ) {
    // Verify category exists
    const category = await this.prisma.category.findFirst({
      where: { id: createProductDto.categoryId, businessId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    let imageUrl = createProductDto.imageUrl;

    if (file) {
      const uploadResult = await this.uploadService.uploadToImageKit(file);
      imageUrl = uploadResult.url;
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        imageUrl,
        businessId, // Link to business
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(businessId: string, categoryId?: string, search?: string) {
    const where: any = { businessId }; // Filter by business

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string, businessId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, businessId },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    businessId: string,
    file?: Express.Multer.File,
  ) {
    await this.findOne(id, businessId);

    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: updateProductDto.categoryId, businessId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    let imageUrl = updateProductDto.imageUrl;

    if (file) {
      const uploadResult = await this.uploadService.uploadToImageKit(file);
      imageUrl = uploadResult.url;
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        ...(imageUrl !== undefined && { imageUrl }), // Only update imageUrl if it's explicitly provided or new file uploaded
      },
      include: {
        category: true,
      },
    });
  }

  async updateStock(
    id: string,
    updateStockDto: UpdateStockDto,
    businessId: string,
  ) {
    await this.findOne(id, businessId);

    const status =
      updateStockDto.stock > 0
        ? ProductStatus.AVAILABLE
        : ProductStatus.OUT_OF_STOCK;

    return this.prisma.product.update({
      where: { id },
      data: {
        stock: updateStockDto.stock,
        status,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string, businessId: string) {
    await this.findOne(id, businessId);

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }
}

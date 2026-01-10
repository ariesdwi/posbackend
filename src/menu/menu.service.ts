import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, UpdateStockDto } from './dto/product.dto';
import { ProductStatus } from '@prisma/client';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
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
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(categoryId?: string, search?: string) {
    const where: any = {};

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

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File) {
    await this.findOne(id);

    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
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

  async updateStock(id: string, updateStockDto: UpdateStockDto) {
    await this.findOne(id);

    const status = updateStockDto.stock > 0 ? ProductStatus.AVAILABLE : ProductStatus.OUT_OF_STOCK;

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

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }
}

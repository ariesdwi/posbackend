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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const upload_service_1 = require("../upload/upload.service");
let MenuService = class MenuService {
    prisma;
    uploadService;
    constructor(prisma, uploadService) {
        this.prisma = prisma;
        this.uploadService = uploadService;
    }
    async create(createProductDto, businessId, file) {
        const category = await this.prisma.category.findFirst({
            where: { id: createProductDto.categoryId, businessId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
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
                businessId,
            },
            include: {
                category: true,
            },
        });
    }
    async findAll(businessId, categoryId, search) {
        const where = { businessId };
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
    async findOne(id, businessId) {
        const product = await this.prisma.product.findFirst({
            where: { id, businessId },
            include: {
                category: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(id, updateProductDto, businessId, file) {
        await this.findOne(id, businessId);
        if (updateProductDto.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: { id: updateProductDto.categoryId, businessId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
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
                ...(imageUrl !== undefined && { imageUrl }),
            },
            include: {
                category: true,
            },
        });
    }
    async updateStock(id, updateStockDto, businessId) {
        await this.findOne(id, businessId);
        const status = updateStockDto.stock > 0 ? client_1.ProductStatus.AVAILABLE : client_1.ProductStatus.OUT_OF_STOCK;
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
    async remove(id, businessId) {
        await this.findOne(id, businessId);
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Product deleted successfully' };
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        upload_service_1.UploadService])
], MenuService);
//# sourceMappingURL=menu.service.js.map
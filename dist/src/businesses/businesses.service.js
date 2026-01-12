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
exports.BusinessesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BusinessesService = class BusinessesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBusinessDto) {
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
    async findOne(id) {
        const business = await this.prisma.business.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        isActive: true,
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
            throw new common_1.NotFoundException(`Business with ID ${id} not found`);
        }
        return business;
    }
    async update(id, updateBusinessDto) {
        const business = await this.prisma.business.findUnique({
            where: { id },
        });
        if (!business) {
            throw new common_1.NotFoundException(`Business with ID ${id} not found`);
        }
        const updated = await this.prisma.business.update({
            where: { id },
            data: updateBusinessDto,
        });
        return updated;
    }
    async remove(id) {
        const business = await this.prisma.business.findUnique({
            where: { id },
        });
        if (!business) {
            throw new common_1.NotFoundException(`Business with ID ${id} not found`);
        }
        await this.prisma.business.delete({
            where: { id },
        });
        return { message: 'Business deleted successfully', id };
    }
    async getStats(id) {
        const business = await this.prisma.business.findUnique({
            where: { id },
        });
        if (!business) {
            throw new common_1.NotFoundException(`Business with ID ${id} not found`);
        }
        const [userCount, productCount, categoryCount, transactionCount] = await Promise.all([
            this.prisma.user.count({ where: { businessId: id } }),
            this.prisma.product.count({ where: { businessId: id } }),
            this.prisma.category.count({ where: { businessId: id } }),
            this.prisma.transaction.count({ where: { businessId: id } }),
        ]);
        const transactions = await this.prisma.transaction.findMany({
            where: {
                businessId: id,
                status: 'COMPLETED',
            },
            select: {
                totalAmount: true,
            },
        });
        const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
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
};
exports.BusinessesService = BusinessesService;
exports.BusinessesService = BusinessesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessesService);
//# sourceMappingURL=businesses.service.js.map
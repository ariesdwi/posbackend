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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTransactionDto, userId) {
        const { items, paymentMethod, paymentAmount, notes } = createTransactionDto;
        const productIds = items.map((item) => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        if (products.length !== productIds.length) {
            throw new common_1.NotFoundException('One or more products not found');
        }
        for (const item of items) {
            const product = products.find((p) => p.id === item.productId);
            if (!product)
                continue;
            if (product.status === client_1.ProductStatus.OUT_OF_STOCK) {
                throw new common_1.BadRequestException(`Product ${product.name} is out of stock`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
            }
        }
        let totalAmount = 0;
        const transactionItems = items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
                throw new common_1.NotFoundException(`Product not found: ${item.productId}`);
            }
            const price = Number(product.price);
            const subtotal = price * item.quantity;
            totalAmount += subtotal;
            return {
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
                price: new client_1.Prisma.Decimal(price),
                subtotal: new client_1.Prisma.Decimal(subtotal),
            };
        });
        const changeAmount = paymentAmount && paymentAmount >= totalAmount
            ? paymentAmount - totalAmount
            : 0;
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
        const transaction = await this.prisma.$transaction(async (tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    transactionNumber,
                    userId,
                    totalAmount: new client_1.Prisma.Decimal(totalAmount),
                    paymentMethod,
                    paymentAmount: paymentAmount
                        ? new client_1.Prisma.Decimal(paymentAmount)
                        : null,
                    changeAmount: new client_1.Prisma.Decimal(changeAmount),
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
            for (const item of items) {
                const product = products.find((p) => p.id === item.productId);
                if (!product)
                    continue;
                const newStock = product.stock - item.quantity;
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: newStock,
                        status: newStock > 0 ? client_1.ProductStatus.AVAILABLE : client_1.ProductStatus.OUT_OF_STOCK,
                    },
                });
            }
            return newTransaction;
        });
        return transaction;
    }
    async findAll(startDate, endDate, status, userId) {
        const where = {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    async updateStatus(id, updateStatusDto) {
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
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map
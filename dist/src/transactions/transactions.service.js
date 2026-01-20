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
    async create(createTransactionDto, userId, businessId) {
        const { items, tableNumber, paymentMethod, paymentAmount, notes, status } = createTransactionDto;
        const productIds = items.map((item) => item.productId);
        const products = await this.prisma.product.findMany({
            where: {
                id: { in: productIds },
                businessId,
            },
        });
        if (products.length !== productIds.length) {
            throw new common_1.NotFoundException('One or more products not found');
        }
        let existingTransaction = null;
        if (tableNumber) {
            existingTransaction = await this.prisma.transaction.findFirst({
                where: {
                    tableNumber,
                    status: client_1.TransactionStatus.PENDING,
                    businessId,
                },
                include: { items: true },
            });
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
        let additionalAmount = 0;
        const transactionItems = items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
                throw new common_1.NotFoundException(`Product not found: ${item.productId}`);
            }
            const price = Number(product.price);
            const costPrice = Number(product.costPrice || 0);
            const subtotal = price * item.quantity;
            additionalAmount += subtotal;
            return {
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
                price: new client_1.Prisma.Decimal(price),
                costPrice: new client_1.Prisma.Decimal(costPrice),
                subtotal: new client_1.Prisma.Decimal(subtotal),
            };
        });
        if (existingTransaction) {
            const newTotalAmount = Number(existingTransaction.totalAmount) + additionalAmount;
            return this.prisma.$transaction(async (tx) => {
                const updatedTransaction = await tx.transaction.update({
                    where: { id: existingTransaction.id },
                    data: {
                        totalAmount: new client_1.Prisma.Decimal(newTotalAmount),
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
                for (const item of items) {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product)
                        continue;
                    const newStock = product.stock - item.quantity;
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: newStock,
                            status: newStock > 0
                                ? client_1.ProductStatus.AVAILABLE
                                : client_1.ProductStatus.OUT_OF_STOCK,
                        },
                    });
                }
                return updatedTransaction;
            });
        }
        const totalAmount = additionalAmount;
        const finalStatus = status || client_1.TransactionStatus.PENDING;
        const changeAmount = finalStatus === client_1.TransactionStatus.COMPLETED &&
            paymentAmount &&
            paymentAmount >= totalAmount
            ? paymentAmount - totalAmount
            : 0;
        const generateTransactionNumber = async (attempt = 0) => {
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
            const count = await this.prisma.transaction.count({
                where: {
                    businessId,
                    createdAt: {
                        gte: new Date(today.setHours(0, 0, 0, 0)),
                        lt: new Date(today.setHours(23, 59, 59, 999)),
                    },
                },
            });
            const suffix = attempt > 0 ? `-${Math.random().toString(36).substring(2, 6).toUpperCase()}` : '';
            return `TRX-${dateStr}-${String(count + 1).padStart(4, '0')}${suffix}`;
        };
        const maxRetries = 3;
        let lastError;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const transactionNumber = await generateTransactionNumber(attempt);
                return await this.prisma.$transaction(async (tx) => {
                    const newTransaction = await tx.transaction.create({
                        data: {
                            transactionNumber,
                            userId,
                            businessId,
                            tableNumber,
                            totalAmount: new client_1.Prisma.Decimal(totalAmount),
                            paymentMethod: paymentMethod || undefined,
                            paymentAmount: paymentAmount
                                ? new client_1.Prisma.Decimal(paymentAmount)
                                : null,
                            changeAmount: new client_1.Prisma.Decimal(changeAmount),
                            status: finalStatus,
                            notes,
                            items: {
                                create: transactionItems,
                            },
                        },
                        include: {
                            items: { include: { product: true } },
                            user: { select: { id: true, name: true, email: true } },
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
                                status: newStock > 0
                                    ? client_1.ProductStatus.AVAILABLE
                                    : client_1.ProductStatus.OUT_OF_STOCK,
                            },
                        });
                    }
                    return newTransaction;
                });
            }
            catch (error) {
                lastError = error;
                if (error?.code === 'P2002' && error?.meta?.target?.includes('transactionNumber')) {
                    continue;
                }
                throw error;
            }
        }
        throw lastError;
    }
    async checkout(id, checkoutDto, businessId) {
        const transaction = await this.findOne(id, businessId);
        if (transaction.status !== client_1.TransactionStatus.PENDING) {
            throw new common_1.BadRequestException('Transaction is already completed or cancelled');
        }
        const totalAmount = Number(transaction.totalAmount);
        if (checkoutDto.paymentAmount < totalAmount) {
            throw new common_1.BadRequestException(`Insufficient payment. Total: ${totalAmount}, Provided: ${checkoutDto.paymentAmount}`);
        }
        const changeAmount = checkoutDto.paymentAmount - totalAmount;
        return this.prisma.transaction.update({
            where: { id },
            data: {
                paymentMethod: checkoutDto.paymentMethod,
                paymentAmount: new client_1.Prisma.Decimal(checkoutDto.paymentAmount),
                changeAmount: new client_1.Prisma.Decimal(changeAmount),
                status: client_1.TransactionStatus.COMPLETED,
                notes: checkoutDto.notes || transaction.notes,
            },
            include: {
                items: { include: { product: true } },
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async findAll(businessId, startDate, endDate, status, userId, tableNumber) {
        const where = { businessId };
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
    async findOne(id, businessId) {
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
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    async updateStatus(id, updateStatusDto, businessId) {
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
    async update(id, updateDto, businessId) {
        const transaction = await this.findOne(id, businessId);
        if (transaction.status !== client_1.TransactionStatus.PENDING) {
            throw new common_1.BadRequestException('Only PENDING transactions can be updated. This transaction is already completed or cancelled.');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.transactionItem.deleteMany({
                where: { transactionId: id },
            });
            const transactionItems = updateDto.items.map((item) => ({
                productId: item.productId || null,
                productName: item.productName,
                quantity: item.quantity,
                price: new client_1.Prisma.Decimal(item.price),
                subtotal: new client_1.Prisma.Decimal(item.subtotal),
            }));
            const updatedTransaction = await tx.transaction.update({
                where: { id },
                data: {
                    totalAmount: new client_1.Prisma.Decimal(updateDto.total),
                    tableNumber: updateDto.tableNumber ?? transaction.tableNumber,
                    notes: updateDto.notes ?? transaction.notes,
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
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map
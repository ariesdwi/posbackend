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
exports.ReceiptsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let ReceiptsService = class ReceiptsService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async generateWhatsAppReceipt(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                items: true,
                user: true,
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        const storeName = this.configService.get('STORE_NAME') || 'Toko Anda';
        const storeAddress = this.configService.get('STORE_ADDRESS') || 'Jl. Contoh No. 123';
        const storePhone = this.configService.get('STORE_PHONE') || '0812-3456-7890';
        const date = new Date(transaction.createdAt);
        const formattedDate = date.toLocaleDateString('id-ID');
        const formattedTime = date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
        let receipt = `*${storeName}*\n`;
        receipt += `${storeAddress}\n`;
        receipt += `Telp: ${storePhone}\n`;
        receipt += `================================\n\n`;
        receipt += `*NOTA PEMBELIAN*\n\n`;
        receipt += `No: ${transaction.transactionNumber}\n`;
        receipt += `Tanggal: ${formattedDate} ${formattedTime}\n`;
        receipt += `Kasir: ${transaction.user.name}\n`;
        receipt += `================================\n\n`;
        transaction.items.forEach((item) => {
            const itemTotal = Number(item.subtotal);
            receipt += `*${item.productName}*\n`;
            receipt += `  ${item.quantity} x ${this.formatCurrency(Number(item.price))} = ${this.formatCurrency(itemTotal)}\n`;
        });
        receipt += `\n================================\n`;
        receipt += `*Total: ${this.formatCurrency(Number(transaction.totalAmount))}*\n`;
        if (transaction.paymentAmount) {
            receipt += `Bayar: ${this.formatCurrency(Number(transaction.paymentAmount))}\n`;
            receipt += `Kembali: ${this.formatCurrency(Number(transaction.changeAmount))}\n`;
        }
        receipt += `================================\n\n`;
        receipt += `Terima kasih atas kunjungan Anda!\n`;
        receipt += `Semoga hari Anda menyenangkan! 😊`;
        return receipt;
    }
    async generateThermalReceipt(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                items: true,
                user: true,
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        const storeName = this.configService.get('STORE_NAME') || 'Toko Anda';
        const storeAddress = this.configService.get('STORE_ADDRESS') || 'Jl. Contoh No. 123';
        const storePhone = this.configService.get('STORE_PHONE') || '0812-3456-7890';
        const date = new Date(transaction.createdAt);
        const formattedDate = date.toLocaleDateString('id-ID');
        const formattedTime = date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
        const width = 32;
        let receipt = '';
        receipt += this.centerText(storeName, width) + '\n';
        receipt += this.centerText(storeAddress, width) + '\n';
        receipt += this.centerText(`Telp: ${storePhone}`, width) + '\n';
        receipt += '='.repeat(width) + '\n';
        receipt += `No: ${transaction.transactionNumber}\n`;
        receipt += `Tanggal: ${formattedDate} ${formattedTime}\n`;
        receipt += `Kasir: ${transaction.user.name}\n`;
        receipt += '-'.repeat(width) + '\n';
        receipt += this.padText('Item', 'Qty', 'Harga', width) + '\n';
        receipt += '-'.repeat(width) + '\n';
        transaction.items.forEach((item) => {
            const name = this.truncate(item.productName, 20);
            const qty = item.quantity.toString();
            const price = this.formatCurrency(Number(item.subtotal));
            receipt += this.formatItemLine(name, qty, price, width) + '\n';
        });
        receipt += '-'.repeat(width) + '\n';
        receipt +=
            this.rightAlign(`Subtotal: ${this.formatCurrency(Number(transaction.totalAmount))}`, width) + '\n';
        if (transaction.paymentAmount) {
            receipt +=
                this.rightAlign(`Bayar: ${this.formatCurrency(Number(transaction.paymentAmount))}`, width) + '\n';
            receipt +=
                this.rightAlign(`Kembali: ${this.formatCurrency(Number(transaction.changeAmount))}`, width) + '\n';
        }
        receipt += '='.repeat(width) + '\n';
        receipt += this.centerText('Terima Kasih!', width) + '\n';
        receipt += this.centerText('Semoga Hari Anda Menyenangkan', width) + '\n';
        receipt += '='.repeat(width) + '\n';
        return receipt;
    }
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    }
    centerText(text, width) {
        const padding = Math.max(0, Math.floor((width - text.length) / 2));
        return ' '.repeat(padding) + text;
    }
    rightAlign(text, width) {
        const padding = Math.max(0, width - text.length);
        return ' '.repeat(padding) + text;
    }
    truncate(text, maxLength) {
        return text.length > maxLength
            ? text.substring(0, maxLength - 3) + '...'
            : text;
    }
    padText(col1, col2, col3, width) {
        const col1Width = Math.floor(width * 0.5);
        const col2Width = Math.floor(width * 0.15);
        const col3Width = width - col1Width - col2Width;
        return (col1.padEnd(col1Width) + col2.padEnd(col2Width) + col3.padStart(col3Width));
    }
    formatItemLine(name, qty, price, width) {
        const col1Width = Math.floor(width * 0.5);
        const col2Width = Math.floor(width * 0.15);
        const col3Width = width - col1Width - col2Width;
        return (name.padEnd(col1Width) + qty.padEnd(col2Width) + price.padStart(col3Width));
    }
};
exports.ReceiptsService = ReceiptsService;
exports.ReceiptsService = ReceiptsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], ReceiptsService);
//# sourceMappingURL=receipts.service.js.map
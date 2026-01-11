import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReceiptsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async generateWhatsAppReceipt(transactionId: string): Promise<string> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        items: true,
        user: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const storeName = this.configService.get('STORE_NAME') || 'Toko Anda';
    const storeAddress =
      this.configService.get('STORE_ADDRESS') || 'Jl. Contoh No. 123';
    const storePhone =
      this.configService.get('STORE_PHONE') || '0812-3456-7890';

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

    // Items
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

  async generateThermalReceipt(transactionId: string): Promise<string> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        items: true,
        user: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const storeName = this.configService.get('STORE_NAME') || 'Toko Anda';
    const storeAddress =
      this.configService.get('STORE_ADDRESS') || 'Jl. Contoh No. 123';
    const storePhone =
      this.configService.get('STORE_PHONE') || '0812-3456-7890';

    const date = new Date(transaction.createdAt);
    const formattedDate = date.toLocaleDateString('id-ID');
    const formattedTime = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const width = 32; // Standard 58mm thermal printer width in characters

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

    // Items
    transaction.items.forEach((item) => {
      const name = this.truncate(item.productName, 20);
      const qty = item.quantity.toString();
      const price = this.formatCurrency(Number(item.subtotal));
      receipt += this.formatItemLine(name, qty, price, width) + '\n';
    });

    receipt += '-'.repeat(width) + '\n';
    receipt +=
      this.rightAlign(
        `Subtotal: ${this.formatCurrency(Number(transaction.totalAmount))}`,
        width,
      ) + '\n';

    if (transaction.paymentAmount) {
      receipt +=
        this.rightAlign(
          `Bayar: ${this.formatCurrency(Number(transaction.paymentAmount))}`,
          width,
        ) + '\n';
      receipt +=
        this.rightAlign(
          `Kembali: ${this.formatCurrency(Number(transaction.changeAmount))}`,
          width,
        ) + '\n';
    }

    receipt += '='.repeat(width) + '\n';
    receipt += this.centerText('Terima Kasih!', width) + '\n';
    receipt += this.centerText('Semoga Hari Anda Menyenangkan', width) + '\n';
    receipt += '='.repeat(width) + '\n';

    return receipt;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  private centerText(text: string, width: number): string {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  }

  private rightAlign(text: string, width: number): string {
    const padding = Math.max(0, width - text.length);
    return ' '.repeat(padding) + text;
  }

  private truncate(text: string, maxLength: number): string {
    return text.length > maxLength
      ? text.substring(0, maxLength - 3) + '...'
      : text;
  }

  private padText(
    col1: string,
    col2: string,
    col3: string,
    width: number,
  ): string {
    const col1Width = Math.floor(width * 0.5);
    const col2Width = Math.floor(width * 0.15);
    const col3Width = width - col1Width - col2Width;

    return (
      col1.padEnd(col1Width) + col2.padEnd(col2Width) + col3.padStart(col3Width)
    );
  }

  private formatItemLine(
    name: string,
    qty: string,
    price: string,
    width: number,
  ): string {
    const col1Width = Math.floor(width * 0.5);
    const col2Width = Math.floor(width * 0.15);
    const col3Width = width - col1Width - col2Width;

    return (
      name.padEnd(col1Width) + qty.padEnd(col2Width) + price.padStart(col3Width)
    );
  }
}

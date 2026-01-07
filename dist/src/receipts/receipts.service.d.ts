import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class ReceiptsService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateWhatsAppReceipt(transactionId: string): Promise<string>;
    generateThermalReceipt(transactionId: string): Promise<string>;
    private formatCurrency;
    private centerText;
    private rightAlign;
    private truncate;
    private padText;
    private formatItemLine;
}

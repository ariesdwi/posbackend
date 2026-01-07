import { ReceiptsService } from './receipts.service';
export declare class ReceiptsController {
    private readonly receiptsService;
    constructor(receiptsService: ReceiptsService);
    getWhatsAppReceipt(transactionId: string): Promise<{
        receipt: string;
    }>;
    getThermalReceipt(transactionId: string): Promise<{
        receipt: string;
    }>;
}

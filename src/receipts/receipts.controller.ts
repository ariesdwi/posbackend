import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReceiptsService } from './receipts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Receipts')
@Controller('receipts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Get(':transactionId/whatsapp')
  @ApiOperation({ summary: 'Get WhatsApp formatted receipt' })
  async getWhatsAppReceipt(@Param('transactionId') transactionId: string) {
    const receipt =
      await this.receiptsService.generateWhatsAppReceipt(transactionId);
    return { receipt };
  }

  @Get(':transactionId/thermal')
  @ApiOperation({ summary: 'Get thermal printer formatted receipt' })
  async getThermalReceipt(@Param('transactionId') transactionId: string) {
    const receipt =
      await this.receiptsService.generateThermalReceipt(transactionId);
    return { receipt };
  }
}

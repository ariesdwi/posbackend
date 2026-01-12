import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
  CheckoutDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../common/decorators/user.decorator';
import type { RequestUser } from '../common/decorators/user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create new transaction or append items to existing pending table bill',
  })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @User() user: RequestUser,
  ) {
    return this.transactionsService.create(
      createTransactionDto,
      user.id,
      user.businessId,
    );
  }

  @Post(':id/checkout')
  @ApiOperation({ summary: 'Checkout and finalize payment for a pending bill' })
  checkout(
    @Param('id') id: string,
    @Body() checkoutDto: CheckoutDto,
    @User() user: RequestUser,
  ) {
    return this.transactionsService.checkout(id, checkoutDto, user.businessId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions with filters' })
  @ApiQuery({ name: 'startDate', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-01-31' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'tableNumber', required: false })
  findAll(
    @User() user: RequestUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Query('tableNumber') tableNumber?: string,
  ) {
    return this.transactionsService.findAll(
      user.businessId,
      startDate,
      endDate,
      status,
      userId,
      tableNumber,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  findOne(@Param('id') id: string, @User() user: RequestUser) {
    return this.transactionsService.findOne(id, user.businessId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction items and totals (PENDING only)' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @User() user: RequestUser,
  ) {
    return this.transactionsService.update(
      id,
      updateTransactionDto,
      user.businessId,
    );
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  @ApiOperation({ summary: 'Update transaction status (Admin only)' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTransactionStatusDto,
    @User() user: RequestUser,
  ) {
    return this.transactionsService.updateStatus(
      id,
      updateStatusDto,
      user.businessId,
    );
  }
}

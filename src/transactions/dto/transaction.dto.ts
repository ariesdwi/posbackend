import {
  IsNotEmpty,
  IsArray,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, TransactionStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class TransactionItemDto {
  @ApiProperty({ example: 'product-id' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}

export class CreateTransactionDto {
  @ApiProperty({ type: [TransactionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];

  @ApiProperty({ example: 'Table 1', required: false })
  @IsString()
  @IsOptional()
  tableNumber?: string;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
    required: false,
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({ example: 100000, required: false })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  paymentAmount?: number;

  @ApiProperty({
    enum: TransactionStatus,
    example: TransactionStatus.PENDING,
    required: false,
  })
  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateTransactionStatusDto {
  @ApiProperty({ enum: TransactionStatus })
  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status: TransactionStatus;
}

export class CheckoutDto {
  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  paymentAmount: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateTransactionItemDto {
  @ApiProperty({ example: 'product-id', required: false })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiProperty({ example: 'Nasi Goreng' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  subtotal: number;
}

export class UpdateTransactionDto {
  @ApiProperty({ type: [UpdateTransactionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTransactionItemDto)
  items: UpdateTransactionItemDto[];

  @ApiProperty({ example: 60000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  subtotal: number;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  discount?: number;

  @ApiProperty({ example: 6000, required: false })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  tax?: number;

  @ApiProperty({ example: 66000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  total: number;

  @ApiProperty({ example: 'Table 1', required: false })
  @IsString()
  @IsOptional()
  tableNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

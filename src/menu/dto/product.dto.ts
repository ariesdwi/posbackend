import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Nasi Goreng' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Nasi goreng spesial', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 17500, description: 'Cost price (harga modal)' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  costPrice: number;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiProperty({ example: 'category-id' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ enum: ProductStatus, required: false })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'Nasi Goreng', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Nasi goreng spesial', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 25000, required: false })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 17500, description: 'Cost price (harga modal)', required: false })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  costPrice?: number;

  @ApiProperty({ example: 50, required: false })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: 'category-id', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ enum: ProductStatus, required: false })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}

export class UpdateStockDto {
  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock: number;
}

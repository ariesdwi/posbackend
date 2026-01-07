import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Makanan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Menu makanan', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Makanan', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Menu makanan', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

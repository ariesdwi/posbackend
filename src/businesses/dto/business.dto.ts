import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBusinessDto {
  @ApiProperty({ example: 'Kedai Kopi' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Jl. Sudirman No. 123', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '081234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class UpdateBusinessDto {
  @ApiProperty({ example: 'Kedai Kopi Updated', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Jl. Thamrin No. 456', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '081298765432', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}

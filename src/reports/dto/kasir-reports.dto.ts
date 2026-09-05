import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class KasirActivityQueryDto {
  @ApiProperty({
    required: false,
    example: '2026-07-23',
    description: 'Date to filter (YYYY-MM-DD). Defaults to today.',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class KasirPerformanceQueryDto {
  @ApiProperty({
    required: false,
    example: '2026-07-01',
    description: 'Start date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    required: false,
    example: '2026-07-23',
    description: 'End date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

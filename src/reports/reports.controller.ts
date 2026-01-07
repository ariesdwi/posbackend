import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get daily sales report' })
  @ApiQuery({ name: 'date', example: '2026-01-07' })
  getDailyReport(@Query('date') date: string) {
    const reportDate = date || new Date().toISOString().split('T')[0];
    return this.reportsService.getDailyReport(reportDate);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly sales report' })
  @ApiQuery({ name: 'startDate', example: '2026-01-01' })
  getWeeklyReport(@Query('startDate') startDate: string) {
    const reportDate = startDate || new Date().toISOString().split('T')[0];
    return this.reportsService.getWeeklyReport(reportDate);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly sales report' })
  @ApiQuery({ name: 'month', example: '2026-01' })
  getMonthlyReport(@Query('month') month: string) {
    const reportMonth =
      month ||
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    return this.reportsService.getMonthlyReport(reportMonth);
  }

  @Get('best-sellers')
  @ApiOperation({ summary: 'Get best selling products' })
  @ApiQuery({ name: 'period', enum: ['daily', 'weekly', 'monthly'] })
  @ApiQuery({ name: 'limit', required: false })
  getBestSellers(
    @Query('period') period: 'daily' | 'weekly' | 'monthly' = 'daily',
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.reportsService.getBestSellers(period, limitNum);
  }

  @Get('revenue-by-category')
  @ApiOperation({ summary: 'Get revenue breakdown by category' })
  @ApiQuery({ name: 'startDate', example: '2026-01-01' })
  @ApiQuery({ name: 'endDate', example: '2026-01-31' })
  getRevenueByCategory(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getRevenueByCategory(startDate, endDate);
  }
}

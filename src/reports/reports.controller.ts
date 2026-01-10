import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import type { RequestUser } from '../common/decorators/user.decorator';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('custom')
  @ApiOperation({ summary: 'Get custom date range sales report' })
  @ApiQuery({ name: 'startDate', example: '2026-01-01', description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', example: '2026-01-31', description: 'End date (YYYY-MM-DD)' })
  getCustomReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @User() user: RequestUser,
  ) {
    return this.reportsService.getCustomReport(startDate, endDate, user.businessId);
  }

  @Get('daily')
  @ApiOperation({ summary: 'Get daily sales report' })
  @ApiQuery({ name: 'date', example: '2026-01-07' })
  getDailyReport(@Query('date') date: string, @User() user: RequestUser) {
    const reportDate = date || new Date().toISOString().split('T')[0];
    return this.reportsService.getDailyReport(reportDate, user.businessId);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly sales report' })
  @ApiQuery({ name: 'startDate', example: '2026-01-01' })
  getWeeklyReport(@Query('startDate') startDate: string, @User() user: RequestUser) {
    const reportDate = startDate || new Date().toISOString().split('T')[0];
    return this.reportsService.getWeeklyReport(reportDate, user.businessId);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly sales report' })
  @ApiQuery({ name: 'month', example: '2026-01' })
  getMonthlyReport(@Query('month') month: string, @User() user: RequestUser) {
    const reportMonth =
      month ||
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    return this.reportsService.getMonthlyReport(reportMonth, user.businessId);
  }

  @Get('best-sellers')
  @ApiOperation({ summary: 'Get best selling products' })
  @ApiQuery({ name: 'period', enum: ['daily', 'weekly', 'monthly'] })
  @ApiQuery({ name: 'limit', required: false })
  getBestSellers(
    @Query('period') period: 'daily' | 'weekly' | 'monthly' = 'daily',
    @User() user: RequestUser,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.reportsService.getBestSellers(period, user.businessId, limitNum);
  }

  @Get('revenue-by-category')
  @ApiOperation({ summary: 'Get revenue breakdown by category' })
  @ApiQuery({ name: 'startDate', example: '2026-01-01' })
  @ApiQuery({ name: 'endDate', example: '2026-01-31' })
  getRevenueByCategory(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @User() user: RequestUser,
  ) {
    return this.reportsService.getRevenueByCategory(startDate, endDate, user.businessId);
  }

  @Get('export/pdf')
  @ApiOperation({ summary: 'Export sales report as PDF' })
  @ApiQuery({ name: 'type', enum: ['daily', 'weekly', 'monthly', 'custom'] })
  @ApiQuery({ name: 'date', required: false, description: 'Date for daily report (YYYY-MM-DD)' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for weekly/custom (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for custom (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'month', required: false, description: 'Month for monthly report (YYYY-MM)' })
  async exportPDF(
    @Res() res: Response,
    @Query('type') type: 'daily' | 'weekly' | 'monthly' | 'custom',
    @User() user: RequestUser,
    @Query('date') date?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('month') month?: string,
  ) {
    let reportData: any;

    const businessId = user.businessId;

    switch (type) {
      case 'daily':
        reportData = await this.reportsService.getDailyReport(
          date || new Date().toISOString().split('T')[0],
          businessId,
        );
        break;
      case 'weekly':
        reportData = await this.reportsService.getWeeklyReport(
          startDate || new Date().toISOString().split('T')[0],
          businessId,
        );
        break;
      case 'monthly':
        reportData = await this.reportsService.getMonthlyReport(
          month ||
            `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
          businessId,
        );
        break;
      case 'custom':
        if (!startDate || !endDate) {
          return res.status(400).json({ message: 'startDate and endDate are required' });
        }
        reportData = await this.reportsService.getCustomReport(startDate, endDate, businessId);
        break;
    }

    const pdfBuffer = await this.reportsService.generatePDFReport(reportData);

    const filename = `laporan-${type}-${new Date().toISOString().split('T')[0]}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}

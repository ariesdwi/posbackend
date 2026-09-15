import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShiftsService } from './shifts.service';
import {
  StartShiftDto,
  EndShiftDto,
  ShiftReportResponseDto,
  GetCurrentShiftResponseDto,
} from './dto/shift.dto';
import {
  XReportResponseDto,
  ZReportResponseDto,
  PreCloseShiftDto,
  PreCloseShiftResponseDto,
} from './dto/phase1.dto';

@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post('start')
  async startShift(
    @Request() req: any,
    @Body() dto: StartShiftDto,
  ): Promise<ShiftReportResponseDto> {
    const userId = req.user.id; // Changed from req.user.userId
    const businessId = req.user.businessId;
    return this.shiftsService.startShift(userId, businessId, dto);
  }

  @Post('end')
  async endShift(
    @Request() req: any,
    @Body() dto: EndShiftDto,
  ): Promise<ShiftReportResponseDto> {
    const userId = req.user.id; // Changed from req.user.userId
    const businessId = req.user.businessId;
    return this.shiftsService.endShift(userId, businessId, dto);
  }

  @Get('current')
  async getCurrentShift(
    @Request() req: any,
  ): Promise<GetCurrentShiftResponseDto> {
    const userId = req.user.id; // Changed from req.user.userId
    const businessId = req.user.businessId;
    return this.shiftsService.getCurrentShift(userId, businessId);
  }

  // ============ PHASE 1: X-REPORT & Z-REPORT ENDPOINTS ============

  /**
   * GET /shifts/x-report
   * Generate X-Report (laporan sementara tanpa tutup shift)
   * IMPORTANT: Must be before :shiftId route to avoid conflict
   */
  @Get('x-report')
  async getXReport(@Request() req: any): Promise<XReportResponseDto> {
    const userId = req.user.id;
    const businessId = req.user.businessId;
    return this.shiftsService.getXReport(userId, businessId);
  }

  @Get(':shiftId')
  async getShiftById(
    @Request() req: any,
    @Param('shiftId') shiftId: string,
  ): Promise<ShiftReportResponseDto> {
    const userId = req.user.id; // Changed from req.user.userId
    const businessId = req.user.businessId;
    return this.shiftsService.getShiftById(shiftId, userId, businessId);
  }

  /**
   * GET /shifts/:shiftId/z-report
   * Get Z-Report (final report setelah shift ditutup)
   */
  @Get(':shiftId/z-report')
  async getZReport(
    @Request() req: any,
    @Param('shiftId') shiftId: string,
  ): Promise<ZReportResponseDto> {
    const userId = req.user.id;
    const businessId = req.user.businessId;
    return this.shiftsService.getZReport(shiftId, userId, businessId);
  }

  /**
   * POST /shifts/pre-close
   * Pre-close shift dengan validasi dan warning
   */
  @Post('pre-close')
  async preCloseShift(
    @Request() req: any,
    @Body() dto: PreCloseShiftDto,
  ): Promise<PreCloseShiftResponseDto> {
    const userId = req.user.id;
    const businessId = req.user.businessId;
    return this.shiftsService.preCloseShift(userId, businessId, dto);
  }
}

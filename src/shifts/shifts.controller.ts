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

  @Get(':shiftId')
  async getShiftById(
    @Request() req: any,
    @Param('shiftId') shiftId: string,
  ): Promise<ShiftReportResponseDto> {
    const userId = req.user.id; // Changed from req.user.userId
    const businessId = req.user.businessId;
    return this.shiftsService.getShiftById(shiftId, userId, businessId);
  }
}

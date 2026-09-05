import { PrismaService } from '../prisma/prisma.service';
import { StartShiftDto, EndShiftDto, ShiftReportResponseDto, GetCurrentShiftResponseDto } from './dto/shift.dto';
export declare class ShiftsService {
    private prisma;
    constructor(prisma: PrismaService);
    startShift(userId: string, businessId: string, dto: StartShiftDto): Promise<ShiftReportResponseDto>;
    endShift(userId: string, businessId: string, dto: EndShiftDto): Promise<ShiftReportResponseDto>;
    getCurrentShift(userId: string, businessId: string): Promise<GetCurrentShiftResponseDto>;
    getShiftById(shiftId: string, userId: string, businessId: string): Promise<ShiftReportResponseDto>;
    private buildShiftReport;
}

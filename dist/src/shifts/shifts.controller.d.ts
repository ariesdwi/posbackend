import { ShiftsService } from './shifts.service';
import { StartShiftDto, EndShiftDto, ShiftReportResponseDto, GetCurrentShiftResponseDto } from './dto/shift.dto';
import { XReportResponseDto, ZReportResponseDto, PreCloseShiftDto, PreCloseShiftResponseDto } from './dto/phase1.dto';
export declare class ShiftsController {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
    startShift(req: any, dto: StartShiftDto): Promise<ShiftReportResponseDto>;
    endShift(req: any, dto: EndShiftDto): Promise<ShiftReportResponseDto>;
    getCurrentShift(req: any): Promise<GetCurrentShiftResponseDto>;
    getXReport(req: any): Promise<XReportResponseDto>;
    getShiftById(req: any, shiftId: string): Promise<ShiftReportResponseDto>;
    getZReport(req: any, shiftId: string): Promise<ZReportResponseDto>;
    preCloseShift(req: any, dto: PreCloseShiftDto): Promise<PreCloseShiftResponseDto>;
}

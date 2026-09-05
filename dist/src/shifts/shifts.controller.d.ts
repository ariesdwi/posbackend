import { ShiftsService } from './shifts.service';
import { StartShiftDto, EndShiftDto, ShiftReportResponseDto, GetCurrentShiftResponseDto } from './dto/shift.dto';
export declare class ShiftsController {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
    startShift(req: any, dto: StartShiftDto): Promise<ShiftReportResponseDto>;
    endShift(req: any, dto: EndShiftDto): Promise<ShiftReportResponseDto>;
    getCurrentShift(req: any): Promise<GetCurrentShiftResponseDto>;
    getShiftById(req: any, shiftId: string): Promise<ShiftReportResponseDto>;
}

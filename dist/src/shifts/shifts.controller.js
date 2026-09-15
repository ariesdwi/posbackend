"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const shifts_service_1 = require("./shifts.service");
const shift_dto_1 = require("./dto/shift.dto");
const phase1_dto_1 = require("./dto/phase1.dto");
let ShiftsController = class ShiftsController {
    shiftsService;
    constructor(shiftsService) {
        this.shiftsService = shiftsService;
    }
    async startShift(req, dto) {
        const userId = req.user.id;
        const businessId = req.user.businessId;
        return this.shiftsService.startShift(userId, businessId, dto);
    }
    async endShift(req, dto) {
        const userId = req.user.id;
        const businessId = req.user.businessId;
        return this.shiftsService.endShift(userId, businessId, dto);
    }
    async getCurrentShift(req) {
        const userId = req.user.id;
        const businessId = req.user.businessId;
        return this.shiftsService.getCurrentShift(userId, businessId);
    }
    async getXReport(req) {
        const userId = req.user.id;
        const businessId = req.user.businessId;
        return this.shiftsService.getXReport(userId, businessId);
    }
    async getShiftById(req, shiftId) {
        const userId = req.user.id;
        const businessId = req.user.businessId;
        return this.shiftsService.getShiftById(shiftId, userId, businessId);
    }
    async getZReport(req, shiftId) {
        const userId = req.user.id;
        const businessId = req.user.businessId;
        return this.shiftsService.getZReport(shiftId, userId, businessId);
    }
    async preCloseShift(req, dto) {
        const userId = req.user.id;
        const businessId = req.user.businessId;
        return this.shiftsService.preCloseShift(userId, businessId, dto);
    }
};
exports.ShiftsController = ShiftsController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, shift_dto_1.StartShiftDto]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "startShift", null);
__decorate([
    (0, common_1.Post)('end'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, shift_dto_1.EndShiftDto]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "endShift", null);
__decorate([
    (0, common_1.Get)('current'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "getCurrentShift", null);
__decorate([
    (0, common_1.Get)('x-report'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "getXReport", null);
__decorate([
    (0, common_1.Get)(':shiftId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('shiftId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "getShiftById", null);
__decorate([
    (0, common_1.Get)(':shiftId/z-report'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('shiftId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "getZReport", null);
__decorate([
    (0, common_1.Post)('pre-close'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, phase1_dto_1.PreCloseShiftDto]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "preCloseShift", null);
exports.ShiftsController = ShiftsController = __decorate([
    (0, common_1.Controller)('shifts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [shifts_service_1.ShiftsService])
], ShiftsController);
//# sourceMappingURL=shifts.controller.js.map
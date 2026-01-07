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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDailyReport(date) {
        const reportDate = date || new Date().toISOString().split('T')[0];
        return this.reportsService.getDailyReport(reportDate);
    }
    getWeeklyReport(startDate) {
        const reportDate = startDate || new Date().toISOString().split('T')[0];
        return this.reportsService.getWeeklyReport(reportDate);
    }
    getMonthlyReport(month) {
        const reportMonth = month ||
            `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        return this.reportsService.getMonthlyReport(reportMonth);
    }
    getBestSellers(period = 'daily', limit) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.reportsService.getBestSellers(period, limitNum);
    }
    getRevenueByCategory(startDate, endDate) {
        return this.reportsService.getRevenueByCategory(startDate, endDate);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('daily'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily sales report' }),
    (0, swagger_1.ApiQuery)({ name: 'date', example: '2026-01-07' }),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDailyReport", null);
__decorate([
    (0, common_1.Get)('weekly'),
    (0, swagger_1.ApiOperation)({ summary: 'Get weekly sales report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', example: '2026-01-01' }),
    __param(0, (0, common_1.Query)('startDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getWeeklyReport", null);
__decorate([
    (0, common_1.Get)('monthly'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly sales report' }),
    (0, swagger_1.ApiQuery)({ name: 'month', example: '2026-01' }),
    __param(0, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getMonthlyReport", null);
__decorate([
    (0, common_1.Get)('best-sellers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get best selling products' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['daily', 'weekly', 'monthly'] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getBestSellers", null);
__decorate([
    (0, common_1.Get)('revenue-by-category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get revenue breakdown by category' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', example: '2026-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', example: '2026-01-31' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getRevenueByCategory", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map
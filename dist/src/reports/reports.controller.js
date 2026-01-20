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
const user_decorator_1 = require("../common/decorators/user.decorator");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getCustomReport(startDate, endDate, user) {
        return this.reportsService.getCustomReport(startDate, endDate, user.businessId);
    }
    getDailyReport(date, user) {
        const reportDate = date || new Date().toISOString().split('T')[0];
        return this.reportsService.getDailyReport(reportDate, user.businessId);
    }
    getWeeklyReport(startDate, user) {
        const reportDate = startDate || new Date().toISOString().split('T')[0];
        return this.reportsService.getWeeklyReport(reportDate, user.businessId);
    }
    getMonthlyReport(month, user) {
        const reportMonth = month ||
            `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        return this.reportsService.getMonthlyReport(reportMonth, user.businessId);
    }
    getBestSellers(period = 'daily', user, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.reportsService.getBestSellers(period, user.businessId, limitNum);
    }
    getRevenueByCategory(startDate, endDate, user) {
        return this.reportsService.getRevenueByCategory(startDate, endDate, user.businessId);
    }
    getMarginReport(startDate, endDate, user) {
        return this.reportsService.getCustomReport(startDate, endDate, user.businessId);
    }
    async exportPDF(res, type, user, date, startDate, endDate, month) {
        let reportData;
        const businessId = user.businessId;
        switch (type) {
            case 'daily':
                reportData = await this.reportsService.getDailyReport(date || new Date().toISOString().split('T')[0], businessId);
                break;
            case 'weekly':
                reportData = await this.reportsService.getWeeklyReport(startDate || new Date().toISOString().split('T')[0], businessId);
                break;
            case 'monthly':
                reportData = await this.reportsService.getMonthlyReport(month ||
                    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`, businessId);
                break;
            case 'custom':
                if (!startDate || !endDate) {
                    return res
                        .status(400)
                        .json({ message: 'startDate and endDate are required' });
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
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('custom'),
    (0, swagger_1.ApiOperation)({ summary: 'Get custom date range sales report' }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        example: '2026-01-01',
        description: 'Start date (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        example: '2026-01-31',
        description: 'End date (YYYY-MM-DD)',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCustomReport", null);
__decorate([
    (0, common_1.Get)('daily'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily sales report' }),
    (0, swagger_1.ApiQuery)({ name: 'date', example: '2026-01-07' }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDailyReport", null);
__decorate([
    (0, common_1.Get)('weekly'),
    (0, swagger_1.ApiOperation)({ summary: 'Get weekly sales report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', example: '2026-01-01' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getWeeklyReport", null);
__decorate([
    (0, common_1.Get)('monthly'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly sales report' }),
    (0, swagger_1.ApiQuery)({ name: 'month', example: '2026-01' }),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getMonthlyReport", null);
__decorate([
    (0, common_1.Get)('best-sellers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get best selling products' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['daily', 'weekly', 'monthly'] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getBestSellers", null);
__decorate([
    (0, common_1.Get)('revenue-by-category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get revenue breakdown by category' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', example: '2026-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', example: '2026-01-31' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getRevenueByCategory", null);
__decorate([
    (0, common_1.Get)('margin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get profit margin report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', example: '2026-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', example: '2026-01-31' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getMarginReport", null);
__decorate([
    (0, common_1.Get)('export/pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Export sales report as PDF' }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: ['daily', 'weekly', 'monthly', 'custom'] }),
    (0, swagger_1.ApiQuery)({
        name: 'date',
        required: false,
        description: 'Date for daily report (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date for weekly/custom (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date for custom (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'month',
        required: false,
        description: 'Month for monthly report (YYYY-MM)',
    }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, user_decorator_1.User)()),
    __param(3, (0, common_1.Query)('date')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportPDF", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map
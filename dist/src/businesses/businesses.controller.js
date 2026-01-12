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
exports.BusinessesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const businesses_service_1 = require("./businesses.service");
const business_dto_1 = require("./dto/business.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let BusinessesController = class BusinessesController {
    businessesService;
    constructor(businessesService) {
        this.businessesService = businessesService;
    }
    create(createBusinessDto) {
        return this.businessesService.create(createBusinessDto);
    }
    findAll() {
        return this.businessesService.findAll();
    }
    findOne(id) {
        return this.businessesService.findOne(id);
    }
    getStats(id) {
        return this.businessesService.getStats(id);
    }
    update(id, updateBusinessDto) {
        return this.businessesService.update(id, updateBusinessDto);
    }
    remove(id) {
        return this.businessesService.remove(id);
    }
};
exports.BusinessesController = BusinessesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new business (Platform Admin only)',
        description: 'Create a new business entity for a customer',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Business created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [business_dto_1.CreateBusinessDto]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all businesses (Platform Admin only)',
        description: 'Retrieve list of all businesses in the platform',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Businesses retrieved successfully',
        schema: {
            example: [
                {
                    id: 'business-id',
                    name: 'Kedai Kita',
                    address: 'Jl. Contoh No. 123',
                    phone: '081234567890',
                    createdAt: '2026-01-11T12:00:00.000Z',
                    updatedAt: '2026-01-11T12:00:00.000Z',
                    _count: {
                        users: 3,
                        products: 98,
                        categories: 16,
                        transactions: 45,
                    },
                },
            ],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get business by ID (Platform Admin only)',
        description: 'Retrieve detailed information about a specific business',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Business details retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get business statistics (Platform Admin only)',
        description: 'Retrieve comprehensive statistics for a business',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Business statistics retrieved successfully',
        schema: {
            example: {
                business: {
                    id: 'business-id',
                    name: 'Kedai Kita',
                    address: 'Jl. Contoh No. 123',
                    phone: '081234567890',
                },
                stats: {
                    users: 3,
                    products: 98,
                    categories: 16,
                    transactions: 45,
                    totalRevenue: 1500000,
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update business (Platform Admin only)',
        description: 'Update business information',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, business_dto_1.UpdateBusinessDto]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete business (Platform Admin only)',
        description: 'Delete a business and all its related data (users, products, transactions)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "remove", null);
exports.BusinessesController = BusinessesController = __decorate([
    (0, swagger_1.ApiTags)('Businesses'),
    (0, common_1.Controller)('businesses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [businesses_service_1.BusinessesService])
], BusinessesController);
//# sourceMappingURL=businesses.controller.js.map
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
exports.PublicMenuController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const menu_service_1 = require("./menu.service");
const categories_service_1 = require("../categories/categories.service");
const businesses_service_1 = require("../businesses/businesses.service");
let PublicMenuController = class PublicMenuController {
    menuService;
    categoriesService;
    businessesService;
    constructor(menuService, categoriesService, businessesService) {
        this.menuService = menuService;
        this.categoriesService = categoriesService;
        this.businessesService = businessesService;
    }
    getBusinessInfo(businessId) {
        return this.businessesService.findOnePublic(businessId);
    }
    findAllCategories(businessId) {
        return this.categoriesService.findAll(businessId);
    }
    findAllProducts(businessId, categoryId, search) {
        return this.menuService.findAll(businessId, categoryId, search);
    }
};
exports.PublicMenuController = PublicMenuController;
__decorate([
    (0, common_1.Get)(':businessId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get business information (Public)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Business information retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicMenuController.prototype, "getBusinessInfo", null);
__decorate([
    (0, common_1.Get)(':businessId/categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories for a business (Public)' }),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicMenuController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Get)(':businessId/products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products for a business (Public)' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PublicMenuController.prototype, "findAllProducts", null);
exports.PublicMenuController = PublicMenuController = __decorate([
    (0, swagger_1.ApiTags)('Public Menu'),
    (0, common_1.Controller)('public/menu'),
    __metadata("design:paramtypes", [menu_service_1.MenuService,
        categories_service_1.CategoriesService,
        businesses_service_1.BusinessesService])
], PublicMenuController);
//# sourceMappingURL=public-menu.controller.js.map
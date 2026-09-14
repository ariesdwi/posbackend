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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KasirDailyDetailResponseDto = exports.TransactionDetail = exports.PaymentMethodDetail = exports.ProductSalesDetail = exports.KasirDailyDetailQueryDto = exports.KasirPerformanceQueryDto = exports.KasirActivityQueryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class KasirActivityQueryDto {
    date;
}
exports.KasirActivityQueryDto = KasirActivityQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: '2026-07-23',
        description: 'Date to filter (YYYY-MM-DD). Defaults to today.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], KasirActivityQueryDto.prototype, "date", void 0);
class KasirPerformanceQueryDto {
    startDate;
    endDate;
}
exports.KasirPerformanceQueryDto = KasirPerformanceQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: '2026-07-01',
        description: 'Start date (YYYY-MM-DD)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], KasirPerformanceQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: '2026-07-23',
        description: 'End date (YYYY-MM-DD)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], KasirPerformanceQueryDto.prototype, "endDate", void 0);
class KasirDailyDetailQueryDto {
    date;
}
exports.KasirDailyDetailQueryDto = KasirDailyDetailQueryDto;
class ProductSalesDetail {
    productId;
    productName;
    categoryName;
    quantitySold;
    revenue;
    costPrice;
    profit;
    profitMargin;
    percentage;
}
exports.ProductSalesDetail = ProductSalesDetail;
class PaymentMethodDetail {
    method;
    totalSales;
    totalTransactions;
    percentage;
    expectedCashFromSales;
}
exports.PaymentMethodDetail = PaymentMethodDetail;
class TransactionDetail {
    transactionNumber;
    time;
    totalAmount;
    paymentMethod;
    items;
}
exports.TransactionDetail = TransactionDetail;
class KasirDailyDetailResponseDto {
    date;
    kasirId;
    kasirName;
    summary;
    productBreakdown;
    paymentMethodBreakdown;
    transactions;
    shiftInfo;
}
exports.KasirDailyDetailResponseDto = KasirDailyDetailResponseDto;
//# sourceMappingURL=kasir-reports.dto.js.map
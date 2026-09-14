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
exports.VoidTransactionResponseDto = exports.VoidTransactionDto = exports.PreCloseShiftResponseDto = exports.PreCloseShiftDto = exports.ZReportResponseDto = exports.XReportResponseDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class XReportResponseDto {
    reportType;
    reportNumber;
    generatedAt;
    shift;
    summary;
    paymentMethodBreakdown;
    voidSummary;
    discountSummary;
    topProducts;
    cashReconciliation;
}
exports.XReportResponseDto = XReportResponseDto;
class ZReportResponseDto {
    reportType;
    reportNumber;
    generatedAt;
    shift;
    salesSummary;
    paymentMethodBreakdown;
    cashReconciliation;
    voidSummary;
    discountSummary;
    topProducts;
    xReportHistory;
    notes;
}
exports.ZReportResponseDto = ZReportResponseDto;
class PreCloseShiftDto {
    finalCash;
    edcSettlement;
    qrisSettlement;
    notes;
    technicalIssues;
    inventoryNotes;
}
exports.PreCloseShiftDto = PreCloseShiftDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PreCloseShiftDto.prototype, "finalCash", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PreCloseShiftDto.prototype, "edcSettlement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PreCloseShiftDto.prototype, "qrisSettlement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PreCloseShiftDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PreCloseShiftDto.prototype, "technicalIssues", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PreCloseShiftDto.prototype, "inventoryNotes", void 0);
class PreCloseShiftResponseDto {
    shiftId;
    status;
    previewZReport;
    message;
}
exports.PreCloseShiftResponseDto = PreCloseShiftResponseDto;
class VoidTransactionDto {
    reason;
    notes;
}
exports.VoidTransactionDto = VoidTransactionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoidTransactionDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoidTransactionDto.prototype, "notes", void 0);
class VoidTransactionResponseDto {
    transactionNumber;
    voidedAt;
    voidedBy;
    message;
}
exports.VoidTransactionResponseDto = VoidTransactionResponseDto;
//# sourceMappingURL=phase1.dto.js.map
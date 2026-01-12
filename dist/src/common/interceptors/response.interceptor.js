"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;
        return next.handle().pipe((0, operators_1.map)((data) => ({
            success: true,
            statusCode,
            message: this.getSuccessMessage(context, data),
            data: data,
            timestamp: new Date().toISOString(),
        })));
    }
    getSuccessMessage(context, data) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const method = request.method;
        const path = request.route?.path || request.url;
        if (data && typeof data === 'object' && 'message' in data) {
            return data.message;
        }
        switch (method) {
            case 'POST':
                if (path.includes('login'))
                    return 'Login successful';
                if (path.includes('register'))
                    return 'User registered successfully';
                return 'Resource created successfully';
            case 'PUT':
            case 'PATCH':
                return 'Resource updated successfully';
            case 'DELETE':
                return 'Resource deleted successfully';
            case 'GET':
            default:
                return 'Request successful';
        }
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);
//# sourceMappingURL=response.interceptor.js.map
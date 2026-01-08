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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const imagekit_1 = __importDefault(require("imagekit"));
const path_1 = require("path");
let UploadService = class UploadService {
    imageKit;
    constructor() {
        this.imageKit = new imagekit_1.default({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
        });
    }
    validateImageFile(file) {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
        ];
        return allowedMimeTypes.includes(file.mimetype);
    }
    generateFileName(file) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const ext = (0, path_1.extname)(file.originalname);
        return `${timestamp}-${randomString}${ext}`;
    }
    async uploadToImageKit(file) {
        const fileName = this.generateFileName(file);
        const response = await this.imageKit.upload({
            file: file.buffer,
            fileName: fileName,
            folder: '/pos-images',
            tags: ['pos-product'],
        });
        return {
            fileId: response.fileId,
            name: response.name,
            url: response.url,
            height: response.height,
            width: response.width,
            size: response.size,
            mimetype: file.mimetype,
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            fileId: any;
            imageUrl: any;
            filename: any;
            size: any;
            mimeType: any;
            width: any;
            height: any;
        };
    }>;
}

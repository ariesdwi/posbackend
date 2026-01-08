export declare class UploadService {
    private imageKit;
    constructor();
    validateImageFile(file: Express.Multer.File): boolean;
    generateFileName(file: Express.Multer.File): string;
    uploadToImageKit(file: Express.Multer.File): Promise<any>;
}

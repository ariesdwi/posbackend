import { Injectable } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class UploadService {
  validateImageFile(file: Express.Multer.File): boolean {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    
    return allowedMimeTypes.includes(file.mimetype);
  }

  generateFileName(file: Express.Multer.File): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const ext = extname(file.originalname);
    return `${timestamp}-${randomString}${ext}`;
  }
}

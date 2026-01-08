import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { extname } from 'path';

@Injectable()
export class UploadService {
  private imageKit: ImageKit;

  constructor() {
    this.imageKit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
    });
  }

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

  async uploadToImageKit(file: Express.Multer.File): Promise<any> {
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
}

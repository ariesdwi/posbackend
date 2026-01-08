import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload product image to ImageKit' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (jpg, jpeg, png, gif, webp) - Max 5MB',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Only images (jpg, jpeg, png, gif, webp) are allowed.',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!this.uploadService.validateImageFile(file)) {
      throw new BadRequestException(
        'Invalid file type. Only images (jpg, jpeg, png, gif, webp) are allowed.',
      );
    }

    const uploadResult = await this.uploadService.uploadToImageKit(file);

    return {
      success: true,
      data: {
        fileId: uploadResult.fileId,
        imageUrl: uploadResult.url,
        filename: uploadResult.name,
        size: uploadResult.size,
        mimeType: uploadResult.mimetype,
        width: uploadResult.width,
        height: uploadResult.height,
      },
    };
  }
}

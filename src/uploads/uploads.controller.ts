import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';
import { UploadsService } from './uploads.service';
import { ApiOperation, ApiConsumes } from '@nestjs/swagger';
import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';

const UPLOAD_DIR = 'uploads';

const fileStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.fieldname === 'file') {
    if (file.mimetype.match(/image\/(jpg|jpeg|png|gif|webp)/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!') as any, false);
    }
  } else {
    cb(null, true);
  }
};

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }

  @Post('photo')
  @ApiOperation({ summary: 'Upload une photo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
      fileFilter: fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    }),
  )
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return {
      url: `/${UPLOAD_DIR}/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Post('video')
  @ApiOperation({ summary: 'Upload une vidéo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
      fileFilter: (req, file, cb) => {
        if (file.fieldname === 'file') {
          if (file.mimetype.match(/video\/(mp4|webm|ogg|quicktime)/)) {
            cb(null, true);
          } else {
            cb(new Error('Only video files are allowed!') as any, false);
          }
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
    }),
  )
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return {
      url: `/${UPLOAD_DIR}/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}

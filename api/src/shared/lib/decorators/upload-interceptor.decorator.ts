import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { config } from '../../configs/config';

export function UploadInterceptor(): MethodDecorator {
  return applyDecorators(
    UseInterceptors(FileInterceptor('file', { limits: { fileSize: config.get('upload.maxSize') } })),
  );
}

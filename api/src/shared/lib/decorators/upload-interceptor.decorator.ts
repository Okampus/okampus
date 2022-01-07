import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { config } from '../../../config';

export function UploadInterceptor(): MethodDecorator {
  return applyDecorators(
    UseInterceptors(FileInterceptor('file', { limits: { fileSize: config.get('uploadMaxSize') } })),
  );
}

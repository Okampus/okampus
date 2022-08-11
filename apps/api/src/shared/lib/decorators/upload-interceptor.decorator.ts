import { applyDecorators, BadRequestException, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { config } from '../../configs/config';
import { mimeTypeRegex } from '../../configs/mime-type';

interface Options {
  mimeTypeRegex: RegExp;
}

export function UploadInterceptor(options: Options = { mimeTypeRegex }): MethodDecorator {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        limits: { fileSize: config.get('upload.maxSize') },
        fileFilter: (_req, { mimetype }, done): void => {
          if (options.mimeTypeRegex.test(mimetype))
            done(null, true);
          else
            done(new BadRequestException('Invalid file type'), false);
        },
      }),
    ),
  );
}

export function UploadMultipleInterceptor(fileNames: string[], options: Options = { mimeTypeRegex }): MethodDecorator {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(fileNames.map(name => ({ name, maxCount: 1 })), {
        limits: { fileSize: config.get('upload.maxSize') },
        fileFilter: (_req, { mimetype }, done): void => {
          if (options.mimeTypeRegex.test(mimetype))
            done(null, true);
          else
            done(new BadRequestException('Invalid file type'), false);
        },
      }),
    ),
  );
}

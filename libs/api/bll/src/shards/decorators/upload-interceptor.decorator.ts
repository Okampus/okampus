import { applyDecorators, BadRequestException, UseInterceptors } from '@nestjs/common';
import { MIME_REGEX } from '@okampus/api/shards';
import { MAX_FILE_SIZE } from '@okampus/shared/consts';
import { FileFieldsInterceptor, FileInterceptor } from '@webundsoehne/nest-fastify-file-upload';

interface Options {
  mimeTypeRegex: RegExp | undefined;
}

export function UploadInterceptor(options: Options): MethodDecorator {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        limits: { fileSize: MAX_FILE_SIZE },
        fileFilter: (_req, { mimetype }, done): void => {
          const mimeRegex = options.mimeTypeRegex ?? MIME_REGEX;

          if (mimeRegex.test(mimetype)) done(null, true);
          else done(new BadRequestException('Invalid file type'), false);
        },
      })
    )
  );
}

export function UploadMultipleInterceptor(fileNames: string[], options: Options): MethodDecorator {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(
        fileNames.map((name) => ({ name, maxCount: 1 })),
        {
          limits: { fileSize: MAX_FILE_SIZE },
          fileFilter: (_req, { mimetype }, done): void => {
            const mimeRegex = options.mimeTypeRegex ?? MIME_REGEX;

            if (mimeRegex.test(mimetype)) done(null, true);
            else done(new BadRequestException('Invalid file type'), false);
          },
        }
      )
    )
  );
}

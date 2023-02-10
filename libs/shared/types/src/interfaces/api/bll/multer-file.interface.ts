import type { MulterFile } from '@webundsoehne/nest-fastify-file-upload';
import type { Readable } from 'node:stream';

export interface MulterFileType extends Partial<MulterFile> {
  createReadStream?: () => Readable;
  fileLastModifiedAt?: Date;
}

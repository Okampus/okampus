import { MulterFile } from '@webundsoehne/nest-fastify-file-upload';
import { Readable } from 'node:stream';

export interface MulterFileType extends MulterFile {
  createReadStream?: () => Readable;
  fileLastModifiedAt?: Date;
}

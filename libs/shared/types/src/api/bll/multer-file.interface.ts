import type { Readable } from 'node:stream';

export interface MulterFile {
  fieldname: string;
  originalname?: string;
  encoding?: string;
  typetype: string;
  size: number;
  filename?: string;
  buffer: Buffer;
  fileLastModifiedAt?: Date;
  createReadStream?: () => Readable;
  path?: string;
  destination?: string;
}

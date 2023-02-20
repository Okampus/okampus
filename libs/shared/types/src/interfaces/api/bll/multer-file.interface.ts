import type { Readable } from 'node:stream';

export interface MulterFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
  createReadStream: () => Readable;
  fileLastModifiedAt: Date;
}

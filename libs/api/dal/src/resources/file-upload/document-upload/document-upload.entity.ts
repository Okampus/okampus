import { DocumentUploadRepository } from './document-upload.repository';
import { FileUpload } from '../file-upload.entity';
import { Entity, Enum, Property } from '@mikro-orm/core';
import { DocumentUploadType, FileUploadKind } from '@okampus/shared/enums';
import type { DocumentUploadOptions } from './document-upload.options';

@Entity({ customRepository: () => DocumentUploadRepository })
export class DocumentUpload extends FileUpload {
  @Property({ type: 'smallint', nullable: true })
  numberOfPages: number | null = null;

  @Property({ type: 'int', nullable: true })
  numberOfWords: number | null = null;

  @Enum({ items: () => DocumentUploadType, type: 'string' })
  documentType!: DocumentUploadType;

  constructor(options: DocumentUploadOptions) {
    super({ ...options, fileUploadKind: FileUploadKind.DocumentUpload });
    this.assign({ ...options, fileUploadKind: FileUploadKind.DocumentUpload });
  }
}

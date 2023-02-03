import { Entity, Enum, Property } from '@mikro-orm/core';
import { FileUpload } from '../file-upload.entity';
import { DocumentUploadType, FileUploadKind } from '@okampus/shared/enums';
import { DocumentUploadOptions } from './document-upload.options';
// eslint-disable-next-line import/no-cycle
import { DocumentUploadRepository } from './document-upload.repository';

@Entity({
  customRepository: () => DocumentUploadRepository,
})
export class DocumentUpload extends FileUpload {
  @Property({ type: 'smallint', nullable: true })
  numberOfPages: number | null = null;

  @Property({ type: 'int', nullable: true })
  numberOfWords: number | null = null;

  @Enum(() => DocumentUploadType)
  documentType!: DocumentUploadType;

  constructor(options: DocumentUploadOptions) {
    super({ ...options, fileUploadKind: FileUploadKind.DocumentUpload });
    this.assign(options);
  }
}

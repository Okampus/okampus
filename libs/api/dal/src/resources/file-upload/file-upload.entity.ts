import { FileUploadRepository } from './file-upload.repository';
import { TenantScopedEntity } from '..';
import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import type { FileUploadOptions } from './file-upload.options';

@Entity({ customRepository: () => FileUploadRepository })
export class FileUpload extends TenantScopedEntity {
  [EntityRepositoryType]!: FileUploadRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'number' })
  size!: number;

  @Property({ type: 'text' })
  type!: string;

  @Property({ type: 'text' })
  url!: string;

  @Property({ type: 'datetime' })
  fileLastModifiedAt = new Date();

  constructor(options: FileUploadOptions) {
    super(options);
    this.assign(options);
  }
}

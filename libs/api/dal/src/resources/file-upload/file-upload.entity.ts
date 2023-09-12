import { FileUploadRepository } from './file-upload.repository';
import { TenantScopedHiddableEntity } from '..';
import { Entity, EntityRepositoryType, Property, Unique } from '@mikro-orm/core';
import type { FileUploadOptions } from './file-upload.options';

@Entity({ customRepository: () => FileUploadRepository })
export class FileUpload extends TenantScopedHiddableEntity {
  [EntityRepositoryType]!: FileUploadRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'number' })
  size!: number;

  @Property({ type: 'text' })
  type!: string;

  @Unique()
  @Property({ type: 'text' })
  url!: string;

  @Property({ type: 'datetime', defaultRaw: 'current_timestamp' })
  fileLastModifiedAt = new Date();

  constructor(options: FileUploadOptions) {
    super(options);
    this.assign(options);
  }
}

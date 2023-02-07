import { FileUploadRepository } from './file-upload.repository';
import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { FileUploadKind } from '@okampus/shared/enums';
import type { FileUploadOptions } from './file-upload.options';
import type { Individual } from '../actor/individual/individual.entity';

@Entity({
  customRepository: () => FileUploadRepository,
  discriminatorColumn: 'fileUploadKind',
  discriminatorMap: FileUploadKind,
})
export class FileUpload extends TenantScopedEntity {
  @Enum({ items: () => FileUploadKind, type: 'string' })
  fileUploadKind!: FileUploadKind;

  @ManyToOne({ type: 'Individual', onDelete: 'CASCADE' })
  uploadedBy!: Individual;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'number' })
  size!: number;

  @Property({ type: 'text' })
  mime!: string;

  @Property({ type: 'text' })
  url!: string;

  @Property({ type: 'datetime' })
  lastModifiedAt = new Date();

  // TODO: implement antivirus and NSFW scanning
  // @Property()
  // validated = false;

  constructor(options: FileUploadOptions & { fileUploadKind: FileUploadKind }) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}

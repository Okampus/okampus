import { TenantScopedEntity } from '..';
import { Entity, Property } from '@mikro-orm/core';
import type { UploadOptions } from './upload.options';

@Entity()
export class Upload extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'number' })
  size!: number;

  @Property({ type: 'text' })
  mime!: string;

  @Property({ type: 'text' })
  url!: string;

  @Property({ type: 'datetime' })
  fileLastModifiedAt = new Date();

  constructor(options: UploadOptions) {
    super(options);
    this.assign(options);
  }
}

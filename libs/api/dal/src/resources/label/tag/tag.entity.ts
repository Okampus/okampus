import { TagRepository } from './tag.repository';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { Colors, TagKind } from '@okampus/shared/enums';
import { getColorFromData } from '@okampus/shared/utils';
import type { TagOptions } from './tag.options';

import type { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import type { Individual } from '../../actor/individual/individual.entity';

@Entity({
  discriminatorColumn: 'tagKind',
  discriminatorMap: TagKind,
  customRepository: () => TagRepository,
})
export class Tag extends TenantScopedEntity {
  [EntityRepositoryType]!: TagRepository;

  @Enum({ items: () => TagKind, type: 'string' })
  tagKind!: TagKind;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  slug!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null; // TODO: switch to Content?

  @Enum({ items: () => Colors, type: 'string' })
  color!: Colors;

  @ManyToOne({ type: 'Individual', nullable: true })
  createdBy: Individual | null = null;

  @ManyToOne({ type: 'ImageUpload', nullable: true })
  iconImage: ImageUpload | null = null;

  constructor(options: TagOptions) {
    super({ tenant: options.tenant });
    this.assign(options);

    this.color = getColorFromData(this.name);
  }
}

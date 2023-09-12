import { TagRepository } from './tag.repository';
import { TenantScopedHiddableEntity } from '../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { Colors, TagType } from '@okampus/shared/enums';
import { getColorFromData, randomId, toSlug } from '@okampus/shared/utils';

import type { TagOptions } from './tag.options';
import type { FileUpload } from '../file-upload/file-upload.entity';

@Entity({ customRepository: () => TagRepository })
export class Tag extends TenantScopedHiddableEntity {
  [EntityRepositoryType]!: TagRepository;

  @Enum({ items: () => TagType, type: EnumType })
  type!: TagType;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  slug!: string;

  @Property({ type: 'text', default: '' })
  description = '';

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  image: FileUpload | null = null;

  @Enum({ items: () => Colors, type: EnumType })
  color!: Colors;

  constructor(options: TagOptions) {
    super(options);
    this.assign(options);

    if (!options.slug) this.slug = toSlug(`${options.slug ?? options.name}-${randomId()}`);
    if (!options.color) this.color = getColorFromData(this.name);
  }
}

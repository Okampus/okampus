import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import type { JSONObject } from '@okampus/shared/types';
import type { ContentEditOptions } from './content-edit.options';
import type { Content } from '../content.entity';

@Entity()
export class ContentEdit extends TenantScopedEntity {
  @Property({ type: 'json', nullable: true, default: null })
  addedDiff: JSONObject | null = null;

  @Property({ type: 'text' })
  newVersion!: string;

  @ManyToOne({ type: 'Content', onDelete: 'CASCADE' })
  content!: Content;

  @Property({ type: 'text', nullable: true, default: null })
  note: string | null = null;

  constructor(options: ContentEditOptions) {
    super(options);
    this.assign(options);
  }
}

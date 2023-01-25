import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { JSONObject } from '@okampus/shared/types';
import { Content } from '../content/content.entity';
import { ContentEditOptions } from './content-edit.options';
import { Individual } from '../../actor/individual/individual.entity';

@Entity()
export class ContentEdit extends TenantScopedEntity {
  @Property({ type: 'json' })
  addedDiff!: JSONObject;

  @Property({ type: 'text', nullable: true })
  note: string | null = null;

  @Property({ type: 'smallint' })
  order!: number;

  @ManyToOne({ type: 'Content', onDelete: 'CASCADE' })
  content!: Content;

  @ManyToOne({ type: 'Individual', onDelete: 'CASCADE' })
  editedBy!: Individual;

  constructor(options: ContentEditOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}

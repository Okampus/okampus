import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Collection, Entity, ManyToMany, OneToOne, Property } from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { toSlug } from '@okampus/shared/utils';

import type { Tag } from '../actor/tag/tag.entity';
import type { Individual } from '../individual/individual.entity';
import type { Content } from '../content/content.entity';
import type { ThreadOptions } from './thread.options';

@Entity()
export class Thread extends TenantScopedEntity {
  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  slug!: string;

  @OneToOne({ type: 'Content', onDelete: 'CASCADE' })
  content!: Content;

  @ManyToMany({ type: 'Individual' })
  @TransformCollection()
  contributors = new Collection<Individual>(this, this.createdBy ? [this.createdBy] : []);

  constructor(options: ThreadOptions) {
    super(options);
    this.assign(options);

    if (!options.slug) this.slug = toSlug(this.name);
  }
}

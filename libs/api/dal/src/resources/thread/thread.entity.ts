import { ThreadRepository } from './thread.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Collection, Entity, EntityRepositoryType, ManyToMany, OneToOne, Property } from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { randomId, toSlug } from '@okampus/shared/utils';

import type { Tag } from '../actor/tag/tag.entity';
import type { User } from '../user/user.entity';
import type { Content } from '../content/content.entity';
import type { ThreadOptions } from './thread.options';

@Entity({ customRepository: () => ThreadRepository })
export class Thread extends TenantScopedEntity {
  [EntityRepositoryType]!: ThreadRepository;

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  slug!: string;

  @OneToOne({ type: 'Content', onDelete: 'CASCADE' })
  content!: Content;

  @ManyToMany({ type: 'User' })
  @TransformCollection()
  contributors = new Collection<User>(this, this.createdBy ? [this.createdBy] : []);

  constructor(options: ThreadOptions) {
    super(options);
    this.assign(options);

    this.slug = toSlug(`${options.slug ?? options.name}-${randomId()}`);
  }
}

import { IssueRepository } from './issue.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { TransformCollection } from '@okampus/api/shards';
import { Collection, Entity, EntityRepositoryType, ManyToMany, OneToOne, Property } from '@mikro-orm/core';

import type { Tag } from '../actor/tag/tag.entity';
import type { Content } from '../content/content.entity';
import type { User } from '../user/user.entity';
import type { IssueOptions } from './issue.options';

@Entity({ customRepository: () => IssueRepository })
export abstract class Issue extends TenantScopedEntity {
  [EntityRepositoryType]!: IssueRepository;

  // TODO: add isResolved, etc.

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

  constructor(options: IssueOptions) {
    super(options);
    this.assign(options);
  }
}

import { TenantScopedEntity } from '../tenant-scoped.entity';
import { TransformCollection } from '@okampus/api/shards';
import { Collection, Entity, ManyToMany, OneToOne, Property } from '@mikro-orm/core';
import type { Tag } from '../actor/tag/tag.entity';
import type { Content } from '../content/content.entity';
import type { Individual } from '../individual/individual.entity';
import type { IssueOptions } from './issue.options';

@Entity()
export abstract class Issue extends TenantScopedEntity {
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

  @ManyToMany({ type: 'Individual' })
  @TransformCollection()
  contributors = new Collection<Individual>(this, this.createdBy ? [this.createdBy] : []);

  constructor(options: IssueOptions) {
    super(options);
    this.assign(options);
  }
}

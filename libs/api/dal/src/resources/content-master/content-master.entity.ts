import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Collection, Entity, Enum, EnumType, ManyToMany, OneToOne, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { ContentMasterType } from '@okampus/shared/enums';

import { toSlug } from '@okampus/shared/utils';
import type { Issue } from './issue/issue.entity';
import type { Tag } from '../actor/tag/tag.entity';
import type { Individual } from '../individual/individual.entity';
import type { Content } from '../content/content.entity';
import type { ContentMasterOptions } from './content-master.options';
import type { Event } from '../event/event.entity';

@Entity()
export class ContentMaster extends TenantScopedEntity {
  @Enum({ items: () => ContentMasterType, type: EnumType })
  type!: ContentMasterType;

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  slug!: string;

  @OneToOne({ type: 'Content', onDelete: 'CASCADE' })
  rootContent!: Content;

  @OneToOne({ type: 'Issue', mappedBy: 'content', nullable: true })
  issue: Issue | null = null;

  @OneToOne({ type: 'Event', mappedBy: 'content', nullable: true })
  event: Event | null = null;

  @ManyToMany({ type: 'Individual' })
  @TransformCollection()
  contributors = new Collection<Individual>(this);

  constructor(options: ContentMasterOptions) {
    super(options);
    this.assign(options);

    if (!options.slug) this.slug = toSlug(this.name);
  }
}

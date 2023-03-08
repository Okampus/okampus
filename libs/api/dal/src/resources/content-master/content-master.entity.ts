import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Collection, Entity, Enum, ManyToMany, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { ContentMasterKind } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';
import type { ContentMasterOptions } from './content-master.options';
import type { Validation } from '../interaction/validation/validation.entity';
import type { Reaction } from '../interaction/reaction/reaction.entity';
import type { Report } from '../interaction/report/report.entity';
import type { Vote } from '../interaction/vote/vote.entity';
import type { Favorite } from '../interaction/favorite/favorite.entity';
import type { Ugc } from '../ugc/ugc.entity';
import type { Individual } from '../actor/individual/individual.entity';
import type { Tag } from '../label/tag/tag.entity';
// import { TaggableEntity } from '../../shards/abstract/taggable/taggable.entity';

@Entity({
  discriminatorColumn: 'contentMasterKind',
  discriminatorMap: ContentMasterKind,
  abstract: true,
})
export abstract class ContentMaster extends TenantScopedEntity {
  @Enum({ items: () => ContentMasterKind, type: 'string' })
  contentMasterKind!: ContentMasterKind;

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @Property({ type: 'text' })
  slug!: string;

  @Property({ type: 'text' })
  title!: string;

  @OneToOne({ type: 'Ugc', onDelete: 'CASCADE' })
  rootContent!: Ugc; // TODO: rename to description? switch to Content? ...

  @ManyToMany({ type: 'Individual' })
  @TransformCollection()
  contributors = new Collection<Individual>(this);

  @OneToMany({ type: 'Validation', mappedBy: 'linkedContentMaster' })
  @TransformCollection()
  validations = new Collection<Validation>(this);

  @OneToMany({ type: 'Reaction', mappedBy: 'linkedContentMaster' })
  @TransformCollection()
  reactions = new Collection<Reaction>(this);

  @OneToMany({ type: 'Report', mappedBy: 'linkedContentMaster' })
  @TransformCollection()
  reports = new Collection<Report>(this);

  @OneToMany({ type: 'Vote', mappedBy: 'linkedContentMaster' })
  @TransformCollection()
  votes = new Collection<Vote>(this);

  @OneToMany({ type: 'Favorite', mappedBy: 'linkedContentMaster' })
  @TransformCollection()
  favorites = new Collection<Favorite>(this);

  createdBy(): Individual | null {
    return this.rootContent.author;
  }

  realCreatedBy(): Individual | null {
    return this.rootContent.realAuthor;
  }

  constructor(options: ContentMasterOptions & { contentMasterKind: ContentMasterKind }) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}

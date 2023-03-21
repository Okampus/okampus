import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import {
  Cascade,
  Collection,
  Entity,
  Enum,
  Formula,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { UgcKind } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';
import type { UgcOptions } from './ugc.options';
import type { Reaction } from '../interaction/reaction/reaction.entity';
import type { Report } from '../interaction/report/report.entity';
import type { Vote } from '../interaction/vote/vote.entity';
import type { Favorite } from '../interaction/favorite/favorite.entity';
import type { Individual } from '../actor/individual/individual.entity';
import type { ContentMaster } from '../content-master/content-master.entity';
import type { Org } from '../org/org.entity';
import type { Edit } from '../edit/edit.entity';

@Entity({ discriminatorColumn: 'ugcKind', discriminatorMap: UgcKind, abstract: true })
export class Ugc extends TenantScopedEntity {
  @Enum({ items: () => UgcKind, type: 'string' })
  ugcKind!: UgcKind;

  @Property({ type: 'text' })
  description!: string;

  @Property({ type: 'boolean' })
  isAnonymous = false;

  @Property({ type: 'number' })
  upvoteCount = 0;

  @Property({ type: 'number' })
  downvoteCount = 0;

  @Property({ type: 'number' })
  totalVoteCount = 0;

  @Property({ type: 'number' })
  reportCount = 0;

  @Property({ type: 'number' })
  favoriteCount = 0;

  @Property({ type: 'number' })
  commentCount = 0;

  @OneToMany({ type: 'Vote', mappedBy: 'content' })
  @TransformCollection()
  votes = new Collection<Vote>(this);

  @OneToMany({ type: 'Report', mappedBy: 'content' })
  @TransformCollection()
  reports = new Collection<Report>(this);

  @OneToMany({ type: 'Favorite', mappedBy: 'content' })
  @TransformCollection()
  favorites = new Collection<Favorite>(this);

  @OneToMany({ type: 'Reaction', mappedBy: 'content' })
  @TransformCollection()
  reactions = new Collection<Reaction>(this);

  @OneToMany({ type: 'Edit', mappedBy: 'linkedUgc' })
  @TransformCollection()
  edits = new Collection<Edit>(this);

  @ManyToMany({ type: 'Org', nullable: true, cascade: [Cascade.ALL] })
  @TransformCollection()
  representingOrgs = new Collection<Org>(this);

  @Formula((alias: string) => `${alias}.created_at`)
  lastEdit: Edit | null = null;

  @ManyToOne({ type: 'Individual', onDelete: 'CASCADE', nullable: true })
  author!: Individual | null;

  @ManyToOne({ type: 'ContentMaster', nullable: true })
  contentMaster: ContentMaster | null = null;

  constructor(options: UgcOptions & { ugcKind: UgcKind }) {
    super(options);
    this.assign(options);

    this.author = options.isAnonymous ? options.createdBy : null;
  }
}

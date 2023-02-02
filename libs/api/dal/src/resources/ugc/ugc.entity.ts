import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { UgcOptions } from './ugc.options';
import { UgcKind } from '@okampus/shared/enums';
import type { Reaction } from '../interaction/reaction/reaction.entity';
import type { Report } from '../interaction/report/report.entity';
import type { Vote } from '../interaction/vote/vote.entity';
import type { Favorite } from '../interaction/favorite/favorite.entity';
import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Individual } from '../actor/individual/individual.entity';
import type { ContentMaster } from '../content-master/content-master.entity';
import { TransformCollection } from '@okampus/api/shards';
import { Org } from '../org/org.entity';

@Entity({
  discriminatorColumn: 'ugcKind',
  discriminatorMap: UgcKind,
  abstract: true,
})
export class Ugc extends TenantScopedEntity {
  @Enum(() => UgcKind)
  ugcKind!: UgcKind;

  @ManyToOne({ type: 'Individual', onDelete: 'CASCADE' })
  author!: Individual;

  @ManyToOne({ type: 'Individual', onDelete: 'CASCADE', hidden: true })
  realAuthor!: Individual;

  @Property({ type: 'boolean' })
  isAnonymous = false;

  @ManyToOne({ type: 'Org', nullable: true, cascade: [Cascade.ALL] })
  representingOrg: Org | null = null;

  @ManyToOne({ type: 'ContentMaster', nullable: true })
  contentMaster: ContentMaster | null = null;

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

  constructor(options: UgcOptions & { ugcKind: UgcKind }) {
    super({ tenant: options.tenant });
    this.assign(options);
    // TODO: deal with isAnonymous case
    this.author = options.realAuthor;
  }
}

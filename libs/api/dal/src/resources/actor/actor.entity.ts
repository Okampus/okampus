import { Collection, Entity, ManyToMany, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/core';
import { toSlug } from '@okampus/shared/utils';
import { ActorKind } from '@okampus/shared/enums';
import { nanoid } from 'nanoid';
import type { ActorOptions } from './actor.options';
import type { Social } from '../manage-actor/social/social.entity';
import type { ActorImage } from '../manage-actor/actor-image/actor-image.entity';
import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import type { Tag } from '../label/tag/tag.entity';
import { TransformCollection } from '@okampus/api/shards';
import type { Individual } from './individual/individual.entity';
import type { Org } from '../org/org.entity';
import type { Validation } from '../interaction/validation/validation.entity';
import type { Reaction } from '../interaction/reaction/reaction.entity';
import type { Report } from '../interaction/report/report.entity';
import type { Vote } from '../interaction/vote/vote.entity';
import type { Favorite } from '../interaction/favorite/favorite.entity';

import { ActorRepository } from './actor.repository';

@Entity({ customRepository: () => ActorRepository })
export class Actor extends TenantScopedEntity {
  @OneToOne({ type: 'Individual', mappedBy: 'actor', nullable: true })
  individual: Individual | null = null;

  @OneToOne({ type: 'Org', mappedBy: 'actor', nullable: true })
  org: Org | null = null;

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @Property({ type: 'text' }) // TODO: implement unique by tenant
  slug!: string;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  bio = '';

  @Property({ type: 'text', nullable: true })
  primaryEmail: string | null = null;

  @Property({ type: 'text' })
  @Unique()
  ical = nanoid(23);

  @OneToMany({ type: 'ActorImage', mappedBy: 'actor' })
  @TransformCollection()
  actorImages = new Collection<ActorImage>(this);

  @OneToMany({ type: 'Social', mappedBy: 'actor' })
  @TransformCollection()
  socials = new Collection<Social>(this);

  @OneToMany({ type: 'Validation', mappedBy: 'actor' })
  @TransformCollection()
  validations = new Collection<Validation>(this);

  @OneToMany({ type: 'Reaction', mappedBy: 'actor' })
  @TransformCollection()
  reactions = new Collection<Reaction>(this);

  @OneToMany({ type: 'Report', mappedBy: 'actor' })
  @TransformCollection()
  reports = new Collection<Report>(this);

  @OneToMany({ type: 'Vote', mappedBy: 'actor' })
  @TransformCollection()
  votes = new Collection<Vote>(this);

  @OneToMany({ type: 'Favorite', mappedBy: 'actor' })
  @TransformCollection()
  favorites = new Collection<Favorite>(this);

  public actorKind() {
    return this.individual ? ActorKind.Individual : ActorKind.Org;
  }

  constructor(options: ActorOptions) {
    options.slug = toSlug(options.slug ?? options.name);
    super({ tenant: options.tenant });
    this.assign(options);
  }
}

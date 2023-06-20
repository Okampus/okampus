// eslint-disable-next-line import/no-cycle
import { ActorRepository } from './actor.repository';
import { TenantScopedEntity } from '..';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { toSlug } from '@okampus/shared/utils';

import { nanoid } from 'nanoid';

import type { BankInfo } from './bank-info/bank-info.entity';
import type { Tag } from './tag/tag.entity';
import type { ActorOptions } from './actor.options';
import type { Report } from '../content/report/report.entity';
import type { Favorite } from '../content/favorite/favorite.entity';
import type { Individual } from '../individual/individual.entity';
import type { Team } from '../team/team.entity';
import type { ActorImage } from './actor-image/actor-image.entity';
import type { Social } from './social/social.entity';
import type { LegalUnit } from './legal-unit/legal-unit.entity';

@Entity({ customRepository: () => ActorRepository })
export class Actor extends TenantScopedEntity {
  [EntityRepositoryType]!: ActorRepository;

  @OneToOne({ type: 'Individual', inversedBy: 'actor', nullable: true })
  individual!: Individual | null;

  @OneToOne({ type: 'Team', inversedBy: 'actor', nullable: true })
  team!: Team | null;

  @OneToOne({ type: 'LegalUnit', inversedBy: 'actor', nullable: true })
  legalUnit!: LegalUnit | null;

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @Property({ type: 'text' }) // TODO: implement unique by tenant
  slug!: string;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', default: '' })
  status = '';

  @Property({ type: 'text', default: '' })
  bio = '';

  @Property({ type: 'text', default: '' })
  email = '';

  @Property({ type: 'text', default: '' })
  website = '';

  @Property({ type: 'text' })
  @Unique()
  ical = nanoid(26);

  @OneToMany({ type: 'BankInfo', mappedBy: 'actor' })
  @TransformCollection()
  bankInfos = new Collection<BankInfo>(this);

  @OneToMany({ type: 'ActorImage', mappedBy: 'actor' })
  @TransformCollection()
  actorImages = new Collection<ActorImage>(this);

  @OneToMany({ type: 'Social', mappedBy: 'actor' })
  @TransformCollection()
  socials = new Collection<Social>(this);

  @OneToMany({ type: 'Report', mappedBy: 'actor' })
  @TransformCollection()
  reports = new Collection<Report>(this);

  @OneToMany({ type: 'Favorite', mappedBy: 'actor' })
  @TransformCollection()
  favorites = new Collection<Favorite>(this);

  constructor(options: ActorOptions) {
    super(options);
    this.assign(options);

    this.slug = toSlug(options.slug ?? options.name);
  }
}

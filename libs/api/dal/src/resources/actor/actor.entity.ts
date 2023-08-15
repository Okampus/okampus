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
import { randomId, toSlug } from '@okampus/shared/utils';

import type { Bank } from './bank/bank.entity';
import type { Tag } from './tag/tag.entity';
import type { ActorOptions } from './actor.options';
import type { Report } from '../content/report/report.entity';
import type { Individual } from '../individual/individual.entity';
import type { Team } from '../team/team.entity';
import type { ActorImage } from './actor-image/actor-image.entity';
import type { Social } from './social/social.entity';
import type { LegalUnit } from './legal-unit/legal-unit.entity';
import type { LegalUnitLocation } from './legal-unit-location/legal-unit-location.entity';

@Entity({ customRepository: () => ActorRepository })
export class Actor extends TenantScopedEntity {
  [EntityRepositoryType]!: ActorRepository;

  @Unique()
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

  @Property({ type: 'text', defaultRaw: '"public"."id_generator"(21)' })
  @Unique()
  ical = randomId();

  @OneToOne({ type: 'Individual', mappedBy: 'actor' })
  individual?: Individual;

  @OneToOne({ type: 'Team', mappedBy: 'actor' })
  team?: Team;

  @OneToOne({ type: 'LegalUnit', mappedBy: 'actor' })
  legalUnit?: LegalUnit;

  @OneToOne({ type: 'LegalUnitLocation', mappedBy: 'actor' })
  legalUnitLocation?: LegalUnitLocation;

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @OneToMany({ type: 'Bank', mappedBy: 'actor' })
  @TransformCollection()
  banks = new Collection<Bank>(this);

  @OneToMany({ type: 'ActorImage', mappedBy: 'actor' })
  @TransformCollection()
  actorImages = new Collection<ActorImage>(this);

  @OneToMany({ type: 'Social', mappedBy: 'actor' })
  @TransformCollection()
  socials = new Collection<Social>(this);

  @OneToMany({ type: 'Report', mappedBy: 'actor' })
  @TransformCollection()
  reports = new Collection<Report>(this);

  constructor(options: ActorOptions) {
    super(options);
    this.assign(options);

    if (!options.slug) this.slug = toSlug(`${options.slug ?? options.name}-${randomId()}`);
  }
}

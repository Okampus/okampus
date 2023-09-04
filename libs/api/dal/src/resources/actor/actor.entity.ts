import { ActorRepository } from './actor.repository';
import { TenantScopableEntity } from '../tenant-scoped.entity';
import { Collection, Entity, EntityRepositoryType, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { randomId } from '@okampus/shared/utils';

import type { ActorOptions } from './actor.options';
import type { ActorImage } from './actor-image/actor-image.entity';
import type { BankInfo } from './bank-info/bank-info.entity';
import type { LegalUnit } from './legal-unit/legal-unit.entity';
import type { LegalUnitLocation } from './legal-unit-location/legal-unit-location.entity';
import type { Social } from './social/social.entity';
import type { Tenant } from '..';
import type { Team } from '../team/team.entity';
import type { User } from '../user/user.entity';
import type { Finance } from './finance/finance.entity';

@Entity({ customRepository: () => ActorRepository })
export class Actor extends TenantScopableEntity {
  [EntityRepositoryType]!: ActorRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true, default: null })
  avatar: string | null = null;

  @Property({ type: 'text', nullable: true, default: null })
  banner: string | null = null;

  @Property({ type: 'text', default: '' })
  status = '';

  @Property({ type: 'text', default: '' })
  bio = '';

  @Property({ type: 'text', nullable: true, default: null })
  email: string | null = null;

  @Property({ type: 'text', nullable: true, default: null })
  website: string | null = null;

  @Property({ type: 'text', defaultRaw: '"public"."id_generator"(21)' })
  @Unique()
  ical = randomId();

  @OneToOne({ type: 'User', mappedBy: 'actor' })
  user?: User;

  @OneToOne({ type: 'Team', mappedBy: 'actor' })
  team?: Team;

  @OneToOne({ type: 'Tenant', mappedBy: 'actor' })
  tenant?: Tenant;

  @OneToOne({ type: 'LegalUnit', mappedBy: 'actor' })
  legalUnit?: LegalUnit;

  @OneToOne({ type: 'LegalUnitLocation', mappedBy: 'actor' })
  legalUnitLocation?: LegalUnitLocation;

  @OneToMany({ type: 'BankInfo', mappedBy: 'actor' })
  @TransformCollection()
  bankInfos = new Collection<BankInfo>(this);

  @OneToMany({ type: 'ActorImage', mappedBy: 'actor' })
  @TransformCollection()
  actorImages = new Collection<ActorImage>(this);

  @OneToMany({ type: 'Social', mappedBy: 'actor' })
  @TransformCollection()
  socials = new Collection<Social>(this);

  @OneToMany({ type: 'Finance', mappedBy: 'receivedBy' })
  @TransformCollection()
  receivedTransactions = new Collection<Finance>(this);

  @OneToMany({ type: 'Finance', mappedBy: 'payedBy' })
  @TransformCollection()
  payedTransactions = new Collection<Finance>(this);

  constructor(options: ActorOptions) {
    super(options);
    this.assign(options);
  }
}

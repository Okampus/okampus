import { LegalUnitLocationRepository } from './legal-unit-location.repository';
import { BaseEntity } from '../..';

import { Actor } from '../actor.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';

import { LegalUnitLocationType } from '@okampus/shared/enums';
import type { Location } from '../location/location.entity';

import type { LegalUnitLocationOptions } from './legal-unit-location.options';
import type { LegalUnit } from '../legal-unit/legal-unit.entity';

@Entity({ customRepository: () => LegalUnitLocationRepository })
export class LegalUnitLocation extends BaseEntity {
  [EntityRepositoryType]!: LegalUnitLocationRepository;

  @Enum({ items: () => LegalUnitLocationType, type: EnumType, default: LegalUnitLocationType.Location })
  locationType = LegalUnitLocationType.Location;

  @Property({ type: 'string', nullable: true, default: null })
  nic: string | null = null;

  @Property({ type: 'string' })
  legalName!: string;

  @Property({ type: 'number', nullable: true, default: null })
  bankLocationCode: number | null = null;

  @OneToOne({ type: 'Actor', mappedBy: 'legalUnitLocation' })
  actor: Actor;

  @ManyToOne({ type: 'LegalUnit', nullable: true, default: null })
  legalUnit: LegalUnit | null = null;

  @ManyToOne({ type: 'Location', nullable: true, default: null })
  location: Location | null = null;

  constructor(options: LegalUnitLocationOptions) {
    super();
    this.assign(options);

    this.actor = new Actor({
      name: options.name,
      bio: options.bio,
      email: options.email,
      slug: options.slug,
      status: options.status,
      tags: options.tags,
      createdBy: options.createdBy,
      tenant: options.tenant,
    });
  }
}

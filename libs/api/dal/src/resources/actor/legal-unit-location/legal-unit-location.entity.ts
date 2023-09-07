import { LegalUnitLocationRepository } from './legal-unit-location.repository';
import { Actor } from '../actor.entity';
import { BaseEntity } from '../..';

import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, OneToOne, Property, Unique } from '@mikro-orm/core';

import { LegalUnitLocationType } from '@okampus/shared/enums';
import { toSlug, randomId } from '@okampus/shared/utils';

import type { LegalUnitLocationOptions } from './legal-unit-location.options';
import type { LegalUnit } from '../legal-unit/legal-unit.entity';
import type { Location } from '../../location/location.entity';

@Entity({ customRepository: () => LegalUnitLocationRepository })
export class LegalUnitLocation extends BaseEntity {
  [EntityRepositoryType]!: LegalUnitLocationRepository;

  @Unique()
  @Property({ type: 'text' })
  slug!: string;

  @Enum({ items: () => LegalUnitLocationType, type: EnumType, default: LegalUnitLocationType.Location })
  locationType = LegalUnitLocationType.Location;

  @Property({ type: 'string', nullable: true, default: null })
  nic: string | null = null;

  @Property({ type: 'string', nullable: true, default: null })
  differentSiren: string | null = null;

  @Property({ type: 'string' })
  legalName!: string;

  @Property({ type: 'int', nullable: true, default: null })
  bankLocationCode: number | null = null;

  @OneToOne({ type: 'Actor', inversedBy: 'legalUnitLocation' })
  actor!: Actor;

  @ManyToOne({ type: 'LegalUnit', nullable: true, default: null })
  legalUnit: LegalUnit | null = null;

  @ManyToOne({ type: 'Location', nullable: true, default: null })
  location: Location | null = null;

  constructor(options: LegalUnitLocationOptions) {
    super();
    this.assign(options);

    if (!options.slug) this.slug = toSlug(`${options.name}-${randomId()}`);
    this.actor = new Actor({
      name: options.name,
      bio: options.bio,
      email: options.email,
      status: options.status,
      createdBy: options.createdBy,
      legalUnitLocation: this,
    });
  }
}

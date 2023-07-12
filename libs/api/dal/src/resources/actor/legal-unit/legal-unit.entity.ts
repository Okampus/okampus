import { LegalUnitRepository } from './legal-unit.repository';
import { BaseEntity } from '../..';
import { Actor } from '../actor.entity';

import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { LegalUnitType } from '@okampus/shared/enums';

import type { LegalUnitLocation } from '../legal-unit-location/legal-unit-location.entity';
import type { LegalUnitOptions } from './legal-unit.options';
import type { Location } from '../location/location.entity';

@Entity({ customRepository: () => LegalUnitRepository })
export class LegalUnit extends BaseEntity {
  [EntityRepositoryType]!: LegalUnitRepository;

  @Enum({ items: () => LegalUnitType, type: EnumType })
  type!: LegalUnitType;

  @Property({ type: 'string', nullable: true, default: null })
  siren: string | null = null;

  @Property({ type: 'string', nullable: true, default: null })
  headquartersNic: string | null = null;

  @Property({ type: 'Location', nullable: true, default: null })
  headquartersLocation: Location | null = null;

  @Property({ type: 'string', nullable: true, default: null }) // https://www.insee.fr/fr/information/2028129
  legalCategory: string | null = null;

  @Property({ type: 'string', nullable: true, default: null }) // https://www.insee.fr/fr/information/2406147
  activityCategory: string | null = null;

  @Property({ type: 'string' })
  legalName!: string;

  @Property({ type: 'int', nullable: true, default: null })
  bankCode: number | null = null;

  @OneToOne({ type: 'Actor', inversedBy: 'legalUnit' })
  actor!: Actor; // Actor links Team and LegalUnit together (if needed)

  @ManyToOne({ type: 'LegalUnit', nullable: true, default: null })
  parent: LegalUnit | null = null;

  @OneToMany({ type: 'LegalUnitLocation', mappedBy: 'legalUnit' })
  @TransformCollection()
  legalUnitLocations = new Collection<LegalUnitLocation>(this);

  @OneToMany({ type: 'LegalUnit', mappedBy: 'parent' })
  @TransformCollection()
  children = new Collection<LegalUnit>(this);

  constructor(options: LegalUnitOptions) {
    super();
    this.assign(options);

    this.actor =
      options.actor ??
      new Actor({
        name: options.name,
        bio: options.bio,
        email: options.email,
        slug: options.slug,
        status: options.status,
        tags: options.tags,
        createdBy: options.createdBy,
        tenant: options.tenant,
        legalUnit: this,
      });
  }
}

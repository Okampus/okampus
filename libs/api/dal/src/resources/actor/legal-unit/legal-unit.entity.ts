import { LegalUnitRepository } from './legal-unit.repository';
import { Actor } from '../actor.entity';
import { BaseEntity } from '../..';

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
  Unique,
} from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { LegalUnitType } from '@okampus/shared/enums';
import { toSlug, randomId } from '@okampus/shared/utils';

import type { LegalUnitOptions } from './legal-unit.options';
import type { LegalUnitLocation } from '../legal-unit-location/legal-unit-location.entity';
import type { Location } from '../../location/location.entity';

@Entity({ customRepository: () => LegalUnitRepository })
export class LegalUnit extends BaseEntity {
  [EntityRepositoryType]!: LegalUnitRepository;

  @Unique()
  @Property({ type: 'text' }) // TODO: implement unique by tenant
  slug!: string;

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

  @Property({ type: 'text', nullable: true, default: null })
  website: string | null = null;

  @Property({ type: 'int', nullable: true, default: null })
  bankCode: number | null = null;

  @OneToOne({ type: 'Actor', inversedBy: 'legalUnit' })
  actor!: Actor;

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

    if (!options.slug) this.slug = toSlug(`${options.legalName}-${randomId()}`);
    this.actor = new Actor({
      name: options.name,
      bio: options.bio,
      email: options.email,
      status: options.status,
      createdBy: options.createdBy,
      legalUnit: this,
    });
  }
}

import { LegalUnitRepository } from './legal-unit.repository';
import { TenantScopedEntity } from '../..';
import { Actor } from '../actor.entity';

import { Entity, EntityRepositoryType, Enum, EnumType, OneToOne } from '@mikro-orm/core';
import { LegalUnitType } from '@okampus/shared/enums';

import type { LegalUnitOptions } from './legal-unit.options';

@Entity({ customRepository: () => LegalUnitRepository })
export class LegalUnit extends TenantScopedEntity {
  [EntityRepositoryType]!: LegalUnitRepository;

  @Enum({ items: () => LegalUnitType, type: EnumType })
  type!: LegalUnitType;

  @OneToOne({ type: 'Actor', mappedBy: 'legalUnit' })
  actor!: Actor; // Actor links Team and LegalUnit together (if needed)

  constructor(options: LegalUnitOptions) {
    super(options);
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
      legalUnit: this,
    });
  }
}

import { LegalUnitRepository } from './legal-unit.repository';
import { TenantScopedEntity } from '../..';
import { Actor } from '../actor.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, OneToOne, Property } from '@mikro-orm/core';
import { LegalUnitType } from '@okampus/shared/enums';

import type { LegalUnitOptions } from './legal-unit.options';
import type { Team } from '../../team/team.entity';

@Entity({ customRepository: () => LegalUnitRepository })
export class LegalUnit extends TenantScopedEntity {
  [EntityRepositoryType]!: LegalUnitRepository;

  @OneToOne({ type: 'Actor', mappedBy: 'legalUnit' })
  actor!: Actor;

  @OneToOne({ type: 'Team', mappedBy: 'legalUnit', nullable: true, default: null })
  team: Team | null = null;

  @Property({ type: 'smallint' })
  order!: number;

  @Enum({ items: () => LegalUnitType, type: EnumType })
  type!: LegalUnitType;

  @Property({ type: 'text' })
  pseudo!: string;

  @Property({ type: 'text' })
  url!: string;

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

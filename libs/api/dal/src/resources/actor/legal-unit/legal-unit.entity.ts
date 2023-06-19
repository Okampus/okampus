import { LegalUnitRepository } from './legal-unit.repository';
import { TenantScopedEntity } from '../..';
import { Entity, EntityRepositoryType, Enum, EnumType, OneToOne, Property } from '@mikro-orm/core';
import { LegalUnitType } from '@okampus/shared/enums';
import type { Actor } from '../actor.entity';
import type { LegalUnitOptions } from './legal-unit.options';

@Entity({ customRepository: () => LegalUnitRepository })
export class LegalUnit extends TenantScopedEntity {
  [EntityRepositoryType]!: LegalUnitRepository;

  @OneToOne({ type: 'Actor', mappedBy: 'legalUnit' })
  actor!: Actor;

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
  }
}

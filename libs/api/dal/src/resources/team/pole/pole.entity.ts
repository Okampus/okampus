import { PoleRepository } from './pole.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Property, ManyToOne, Enum, EnumType, EntityRepositoryType } from '@mikro-orm/core';
import { PoleCategory } from '@okampus/shared/enums';

import type { PoleOptions } from './pole.options';
import type { Team } from '../team.entity';

@Entity({ customRepository: () => PoleRepository })
export class Pole extends TenantScopedEntity {
  [EntityRepositoryType]!: PoleRepository;

  @ManyToOne({ type: 'Team', inversedBy: 'poles' })
  team!: Team;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  description!: string;

  @Property({ type: 'boolean' })
  required = false;

  @Enum({ items: () => PoleCategory, type: EnumType })
  category!: PoleCategory;

  constructor(options: PoleOptions) {
    super(options);
    this.assign(options);
  }
}

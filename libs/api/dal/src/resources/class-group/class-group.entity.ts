import { ClassGroupRepository } from './class-group.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, OneToOne, Property } from '@mikro-orm/core';
import { ClassGroupType } from '@okampus/shared/enums';

import type { Team } from '../team/team.entity';
import type { ClassGroupOptions } from './class-group.options';

@Entity({ customRepository: () => ClassGroupRepository })
export class ClassGroup extends TenantScopedEntity {
  [EntityRepositoryType]!: ClassGroupRepository;

  @Property({ type: 'text', nullable: true, default: null })
  description: string | null = null;

  @Enum({ items: () => ClassGroupType, type: EnumType })
  type!: ClassGroupType;

  @OneToOne({ type: 'Team', mappedBy: 'classGroup' })
  team!: Team;

  constructor(options: ClassGroupOptions) {
    super(options);
    this.assign(options);
  }
}

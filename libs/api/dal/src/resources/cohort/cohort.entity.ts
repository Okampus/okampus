import { CohortRepository } from './cohort.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Entity, EntityRepositoryType, OneToOne, Property } from '@mikro-orm/core';

import type { Team } from '../team/team.entity';
import type { CohortOptions } from './cohort.options';

@Entity({ customRepository: () => CohortRepository })
export class Cohort extends TenantScopedEntity {
  [EntityRepositoryType]!: CohortRepository;

  @Property({ type: 'smallint' })
  year!: number;

  @OneToOne({ type: 'Team', mappedBy: 'cohort' })
  team!: Team;

  constructor(options: CohortOptions) {
    super(options);
    this.assign(options);
  }
}

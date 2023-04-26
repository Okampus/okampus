import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Entity, OneToOne, Property } from '@mikro-orm/core';

import type { Team } from '../team/team.entity';
import type { CohortOptions } from './cohort.options';

@Entity()
export class Cohort extends TenantScopedEntity {
  @Property({ type: 'smallint' })
  year!: number;

  @OneToOne({ type: 'Team', mappedBy: 'cohort' })
  team!: Team;

  constructor(options: CohortOptions) {
    super(options);
    this.assign(options);
  }
}

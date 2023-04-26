import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Entity, OneToOne, Property } from '@mikro-orm/core';

import type { Team } from '../team/team.entity';
import type { CanteenOptions } from './canteen.options';

@Entity()
export class Canteen extends TenantScopedEntity {
  @Property({ type: 'text', nullable: true, default: null })
  description: string | null = null;

  @OneToOne({ type: 'Team', mappedBy: 'canteen' })
  team!: Team;

  constructor(options: CanteenOptions) {
    super(options);
    this.assign(options);
  }
}

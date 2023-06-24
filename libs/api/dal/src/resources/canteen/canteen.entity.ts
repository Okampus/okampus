import { CanteenRepository } from './canteen.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Entity, EntityRepositoryType, OneToOne, Property } from '@mikro-orm/core';

import type { Team } from '../team/team.entity';
import type { CanteenOptions } from './canteen.options';

@Entity({ customRepository: () => CanteenRepository })
export class Canteen extends TenantScopedEntity {
  [EntityRepositoryType]!: CanteenRepository;

  @Property({ type: 'text', default: '' })
  description = '';

  @OneToOne({ type: 'Team', mappedBy: 'canteen' })
  team!: Team;

  constructor(options: CanteenOptions) {
    super(options);
    this.assign(options);
  }
}

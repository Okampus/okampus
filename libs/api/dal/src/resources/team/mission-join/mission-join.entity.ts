import { MissionJoinRepository } from './mission-join.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Property, Enum, ManyToOne, EnumType, EntityRepositoryType, OneToOne } from '@mikro-orm/core';
import { ApprovalState } from '@okampus/shared/enums';

import type { MissionJoinOptions } from './mission-join.options';
import type { Individual } from '../../individual/individual.entity';
import type { EventJoin } from '../../event/event-join/event-join.entity';
import type { User } from '../../individual/user/user.entity';
import type { Project } from '../../project/project.entity';
import type { Mission } from '../mission/mission.entity';

@Entity({ customRepository: () => MissionJoinRepository })
export class MissionJoin extends TenantScopedEntity {
  [EntityRepositoryType]!: MissionJoinRepository;

  @Property({ type: 'smallint', nullable: true, default: null })
  points: number | null = null;

  @Enum({ items: () => ApprovalState, type: EnumType, default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  @Property({ type: 'boolean', nullable: true, default: null })
  completed: boolean | null = null;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  settledBy: Individual | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  settledAt: Date | null = null;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  completedSettledBy: Individual | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  completedSettledAt: Date | null = null;

  @ManyToOne({ type: 'Mission' })
  mission!: Mission;

  @ManyToOne({ type: 'User' })
  joiner!: User;

  @OneToOne({ type: 'EventJoin', inversedBy: 'missionJoin', nullable: true, default: null })
  eventJoin: EventJoin | null = null;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  project: Project | null = null;

  constructor(options: MissionJoinOptions) {
    super(options);
    this.assign(options);
  }
}

import { MissionJoinRepository } from './mission-join.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Property, Enum, ManyToOne, EnumType, EntityRepositoryType, OneToOne } from '@mikro-orm/core';
import { ApprovalState } from '@okampus/shared/enums';

import type { MissionJoinOptions } from './mission-join.options';
import type { Mission } from '../mission/mission.entity';
import type { EventJoin } from '../../event/event-join/event-join.entity';
import type { Project } from '../../team/project/project.entity';
import type { User } from '../../user/user.entity';

@Entity({ customRepository: () => MissionJoinRepository })
export class MissionJoin extends TenantScopedEntity {
  [EntityRepositoryType]!: MissionJoinRepository;

  @Enum({ items: () => ApprovalState, type: EnumType, default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  @Property({ type: 'smallint', nullable: true, default: null })
  points: number | null = null;

  @ManyToOne({ type: 'User', nullable: true, default: null })
  processedBy: User | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  processedAt: Date | null = null;

  @ManyToOne({ type: 'User', nullable: true, default: null })
  pointsProcessedBy: User | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  pointsProcessedAt: Date | null = null;

  @ManyToOne({ type: 'Mission' })
  mission!: Mission;

  @ManyToOne({ type: 'User' })
  joinedBy!: User;

  @OneToOne({ type: 'EventJoin', inversedBy: 'missionJoin', nullable: true, default: null })
  eventJoin: EventJoin | null = null;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  project: Project | null = null;

  constructor(options: MissionJoinOptions) {
    super(options);
    this.assign(options);
  }
}

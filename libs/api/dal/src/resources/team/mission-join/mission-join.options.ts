import type { User } from '../../individual/user/user.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Individual } from '../../individual/individual.entity';
import type { MissionJoinProps } from './mission-join.props';
import type { Mission } from '../mission/mission.entity';
import type { EventJoin } from '../../event/event-join/event-join.entity';
import type { Project } from '../../project/project.entity';

export type MissionJoinOptions = TenantScopedOptions &
  MissionJoinProps & {
    processedBy?: Individual | null;
    processedAt?: Date | null;
    pointsProcessedBy?: Individual | null;
    pointsProcessedAt?: Date | null;
    mission: Mission;
    joinedBy: User;
    eventJoin?: EventJoin | null;
    project?: Project | null;
  };

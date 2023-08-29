import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { User } from '../../user/user.entity';
import type { MissionJoinProps } from './mission-join.props';
import type { Mission } from '../mission/mission.entity';
import type { EventJoin } from '../../event/event-join/event-join.entity';
import type { Project } from '../../team/project/project.entity';

export type MissionJoinOptions = TenantScopedOptions &
  MissionJoinProps & {
    processedBy?: User | null;
    processedAt?: Date | null;
    pointsProcessedBy?: User | null;
    pointsProcessedAt?: Date | null;
    mission: Mission;
    joinedBy: User;
    eventJoin?: EventJoin | null;
    project?: Project | null;
  };

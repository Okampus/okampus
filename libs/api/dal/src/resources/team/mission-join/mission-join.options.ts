import type { User } from '../../individual/user/user.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Individual } from '../../individual/individual.entity';
import type { MissionJoinProps } from '@okampus/shared/dtos';
import type { Mission } from '../mission/mission.entity';
import type { EventJoin } from '../../event/event-join/event-join.entity';
import type { Project } from '../../project/project.entity';

export type MissionJoinOptions = TenantScopedOptions &
  MissionJoinProps & {
    settledBy?: Individual | null;
    settledAt?: Date | null;
    completedSettledBy?: Date | null;
    completedSettledAt?: Date | null;
    mission: Mission;
    joiner: User;
    eventJoin?: EventJoin | null;
    project?: Project | null;
  };

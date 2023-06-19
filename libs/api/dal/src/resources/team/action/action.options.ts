import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Team } from '../team.entity';
import type { ActionProps } from '@okampus/shared/dtos';
import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { Individual } from '../../individual/individual.entity';

export type ActionOptions = ActionProps &
  TenantScopedOptions & {
    team: Team;
    user: UserInfo;
    settledBy?: Individual | null;
    settledAt?: Date | null;
    event?: Event | null;
    project?: Project | null;
  };

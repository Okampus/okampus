import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Team } from '../team.entity';
import type { ActionProps } from './action.props';
import type { User } from '../../user/user.entity';

export type ActionOptions = ActionProps &
  TenantScopedOptions & {
    team: Team;
    user: User;
    pointsProcessedBy?: User | null;
    pointsProcessedAt?: Date | null;
    event?: Event | null;
    project?: Project | null;
  };

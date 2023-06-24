import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Team } from '../team.entity';
import type { ActionProps } from '@okampus/shared/dtos';
import type { User } from '../../individual/user/user.entity';
import type { Individual } from '../../individual/individual.entity';

export type ActionOptions = ActionProps &
  TenantScopedOptions & {
    team: Team;
    user: User;
    pointsSettledBy?: Individual | null;
    pointsSettledAt?: Date | null;
    event?: Event | null;
    project?: Project | null;
  };

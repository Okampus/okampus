import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { TeamMember } from '../team-member/team-member.entity';
import type { Team } from '../team.entity';
import type { ActionProps } from '@okampus/shared/dtos';
import type { UserInfo } from '../../individual/user-info/user-info.entity';

export type ActionOptions = ActionProps &
  TenantScopedOptions & {
    team: Team;
    user: UserInfo;
    teamMember?: TeamMember | null;
    event?: Event | null;
    project?: Project | null;
    validatedBy?: TeamMember | null;
  };

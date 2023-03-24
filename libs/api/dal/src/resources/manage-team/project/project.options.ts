import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { ProjectProps } from '@okampus/shared/dtos';
import type { User } from '../../actor/user/user.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { Team } from '../../org/team/team.entity';
import type { TeamMember } from '../../membership/team-member/team-member.entity';
import type { ProjectRole } from '../../role/project-role/project-role.entity';

export type ProjectOptions = ProjectProps &
  TenantScopedOptions & {
    team: Team;
    supervisors: TeamMember[];
    linkedEvents?: TenantEvent[];
    roles?: ProjectRole[];
    participants?: User[];
  };

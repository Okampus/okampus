import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { ProjectProps } from '@okampus/shared/dtos';
import { TeamMember } from '../../membership/team-member/team-member.entity';
import type { User } from '../../actor/user/user.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { Team } from '../../org/team/team.entity';

export type ProjectOptions = ProjectProps &
  TenantScopedOptions & {
    team: Team;
    teamMember: TeamMember;
    linkedEvent?: TenantEvent;
    createdBy: User;
    supervisor: User;
  };

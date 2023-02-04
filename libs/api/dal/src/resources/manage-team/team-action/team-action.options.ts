import type { TeamActionProps } from '@okampus/shared/dtos';
import type { TeamMember } from '../../membership/team-member/team-member.entity';
import type { User } from '../../actor/user/user.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { Team } from '../../org/team/team.entity';
import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';

export type TeamActionOptions = TeamActionProps &
  TenantScopedOptions & {
    team: Team;
    user: User;
    teamMember: TeamMember;
    linkedEvent?: TenantEvent;
    createdBy: User;
    supervisor: User;
  };

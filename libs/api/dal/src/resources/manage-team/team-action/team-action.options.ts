import { TeamActionProps } from '@okampus/shared/dtos';
import { TeamMember } from '../../membership/team-member/team-member.entity';
import { User } from '../../actor/user/user.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import { Team } from '../../org/team/team.entity';
import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';

export type TeamActionOptions = TeamActionProps &
  TenantScopedOptions & {
    team: Team;
    user: User;
    teamMember: TeamMember;
    linkedEvent?: TenantEvent;
    createdBy: User;
    supervisor: User;
  };

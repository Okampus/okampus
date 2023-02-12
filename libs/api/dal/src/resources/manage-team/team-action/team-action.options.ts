import type { TeamActionProps } from '@okampus/shared/dtos';
import type { TeamMember } from '../../membership/team-member/team-member.entity';
import type { User } from '../../actor/user/user.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { Team } from '../../org/team/team.entity';
import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Individual } from '../../actor/individual/individual.entity';
import type { Project } from '../project/project.entity';

export type TeamActionOptions = TeamActionProps &
  TenantScopedOptions & {
    team: Team;
    user: User;
    teamMember?: TeamMember | null;
    linkedEvent?: TenantEvent | null;
    linkedProject?: Project | null;
    createdBy: Individual;
    validatedBy?: TeamMember | null;
  };

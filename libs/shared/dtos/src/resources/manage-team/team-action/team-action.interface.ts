import { IUser } from '../../actor/user/user.interface';
import { ITenantEvent } from '../../content-master/event/event.interface';
import type { ITeamMember } from '../../membership/team-member/team-member.interface';
import { ITeam } from '../../org/team/team.interface';
import { ITenantScoped } from '../../tenant-scoped.interface';
import { TeamActionProps } from './team-action.props';

export type ITeamAction = ITenantScoped &
  TeamActionProps & {
    event?: ITenantEvent;
    team?: ITeam;
    user?: IUser;
    teamMember?: ITeamMember;
  };

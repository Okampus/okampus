import type { IUser } from '../../actor/user/user.interface';
import type { ITenantEvent } from '../../content-master/event/event.interface';
import type { ITeamMember } from '../../membership/team-member/team-member.interface';
import type { ITeam } from '../../org/team/team.interface';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { IProject } from '../project/project.interface';
import type { TeamActionProps } from './team-action.props';

export type ITeamAction = ITenantScoped &
  Required<TeamActionProps> & {
    team?: ITeam;
    user?: IUser;
    teamMember?: ITeamMember | null;
    linkedEvent?: ITenantEvent | null;
    linkedProject?: IProject | null;
    validatedBy?: ITeamMember | null;
  };

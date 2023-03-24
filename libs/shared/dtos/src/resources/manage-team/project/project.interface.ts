import type { IUser } from '../../actor/user/user.interface';
import type { ITenantEvent } from '../../content-master/event/event.interface';
import type { ITeamMember } from '../../membership/team-member/team-member.interface';
import type { ITeam } from '../../org/team/team.interface';
import type { IProjectRole } from '../../role/project-role/project-role.interface';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { ProjectProps } from './project.props';

export type IProject = ITenantScoped &
  ProjectProps & {
    team?: ITeam;
    supervisors?: ITeamMember[];
    roles?: IProjectRole[];
    linkedEvents?: ITenantEvent[];
    participants?: IUser[];
  };

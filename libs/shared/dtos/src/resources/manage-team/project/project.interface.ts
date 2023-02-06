import type { IIndividual } from '../../actor/individual/individual.interface';
import type { IUser } from '../../actor/user/user.interface';
import type { ITenantEvent } from '../../content-master/event/event.interface';
import type { ITeam } from '../../org/team/team.interface';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { ProjectProps } from './project.props';

export type IProject = ITenantScoped &
  ProjectProps & {
    team?: ITeam;
    linkedEvent?: ITenantEvent | null;
    createdBy?: IIndividual;
    supervisor?: IUser;
    participants?: IUser[];
  };

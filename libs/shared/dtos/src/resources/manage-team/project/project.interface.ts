import { IIndividual } from '../../actor/individual/individual.interface';
import { IUser } from '../../actor/user/user.interface';
import { ITenantEvent } from '../../content-master/event/event.interface';
import { ITeam } from '../../org/team/team.interface';
import { ITenantScoped } from '../../tenant-scoped.interface';
import { ProjectProps } from './project.props';

export type IProject = ITenantScoped &
  ProjectProps & {
    team?: ITeam;
    linkedEvent?: ITenantEvent | null;
    createdBy?: IIndividual;
    supervisor?: IUser;
    participants?: IUser[];
  };

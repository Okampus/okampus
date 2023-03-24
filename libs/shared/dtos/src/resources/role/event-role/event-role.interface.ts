import type { IUser } from '../../actor/user/user.interface';
import type { ITenantEvent } from '../../content-master/event/event.interface';
import type { IProjectRole } from '../project-role/project-role.interface';
import type { IRole } from '../role.interface';
import type { EventRoleProps } from './event-role.props';

export type IEventRole = IRole &
  EventRoleProps & {
    linkedProjectRole: IProjectRole;
    event?: ITenantEvent;
    user?: IUser | null;
  };

import type { EventRoleProps } from '@okampus/shared/dtos';
import type { RoleOptions } from '../role.options';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { User } from '../../actor/user/user.entity';
import type { ProjectRole } from '../project-role/project-role.entity';

export type EventRoleOptions = EventRoleProps &
  RoleOptions & {
    linkedProjectRole: ProjectRole;
    event: TenantEvent;
    user?: User | null;
  };

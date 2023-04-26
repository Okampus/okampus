import type { Event } from '../event.entity';
import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { ProjectRole } from '../../project/project-role/project-role.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { EventRoleProps } from '@okampus/shared/dtos';

export type EventRoleOptions = EventRoleProps &
  TenantScopedOptions & {
    event: Event;
    projectRole: ProjectRole;
    user?: UserInfo | null;
  };

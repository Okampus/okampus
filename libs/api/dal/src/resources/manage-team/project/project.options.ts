import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { ProjectProps } from '@okampus/shared/dtos';
import type { User } from '../../actor/user/user.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { Team } from '../../org/team/team.entity';

export type ProjectOptions = ProjectProps &
  TenantScopedOptions & {
    team: Team;
    supervisor: User;
    linkedEvent?: TenantEvent | null;
    participants?: User[];
  };

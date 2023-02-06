import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { ProjectProps } from '@okampus/shared/dtos';
import type { User } from '../../actor/user/user.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { Team } from '../../org/team/team.entity';
import type { Individual } from '../../actor/individual/individual.entity';

export type ProjectOptions = ProjectProps &
  TenantScopedOptions & {
    team: Team;
    createdBy: Individual;
    supervisor: User;
    linkedEvent?: TenantEvent | null;
    participants?: User[];
  };

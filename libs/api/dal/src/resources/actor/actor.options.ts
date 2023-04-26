import type { Individual } from '../individual/individual.entity';
import type { Team } from '../team/team.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { Tag } from './tag/tag.entity';
import type { ActorProps } from '@okampus/shared/dtos';

export type ActorOptions = ActorProps &
  TenantScopedOptions & {
    tags?: Tag[];
    individual?: Individual | null;
    team?: Team | null;
  };

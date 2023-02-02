import { TeamCategoryProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Team } from '../../org/team/team.entity';
import { TagOptions } from '../tag/tag.options';

export type TeamCategoryOptions = TeamCategoryProps &
  TagOptions &
  TenantScopedOptions & {
    teams?: Team[];
  };

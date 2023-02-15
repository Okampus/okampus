import type { PaginationOptions } from '../../../../../shards/types/pagination-options.type';
import type { TenantCore } from '@okampus/api/dal';
import type { TeamFilterOptions } from '../../team-filter-options.type';

export class GetTeamsQuery {
  constructor(
    public readonly filterOptions: TeamFilterOptions,
    public readonly paginationOptions: PaginationOptions,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}

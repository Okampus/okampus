import type { PaginationOptions } from '../../../../../shards/types/pagination-options.type';
import type { TenantCore } from '@okampus/api/dal';
import type { TeamFilterQuery } from '../../team.filter-query';

export class GetTeamsQuery {
  constructor(
    public readonly filterQuery: TeamFilterQuery,
    public readonly paginationOptions: PaginationOptions,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}

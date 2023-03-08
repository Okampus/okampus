import type { PaginationOptions } from '../../../../../shards/types/pagination-options.type';
import type { TenantCore } from '@okampus/api/dal';
import type { UserFilterQuery } from '../../user.filter-query';

export class GetUsersQuery {
  constructor(
    public readonly filterQuery: UserFilterQuery,
    public readonly paginationOptions: PaginationOptions,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}

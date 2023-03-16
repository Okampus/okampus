import type { TenantCore } from '@okampus/api/dal';
import type { PaginationOptions } from '../../../../../shards/types/pagination-options.type';

export class GetTeamJoinsQuery {
  constructor(
    public readonly paginationOptions: PaginationOptions,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}

import type { TenantCore } from '@okampus/api/dal';
import type { PaginationOptions } from '../../../../../shards/types/pagination-options.type';

export class GetBotsQuery {
  constructor(
    public readonly paginationOptions: PaginationOptions,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}

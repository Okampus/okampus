import type { PaginationOptions } from '../../../../../shards/types/pagination-options.type';
import type { TenantCore } from '@okampus/api/dal';

export class GetEventsQuery {
  constructor(
    public readonly paginationOptions: PaginationOptions,
    public readonly tenant: TenantCore,
    public readonly populate: never[] = <never[]>['tenant']
  ) {}
}

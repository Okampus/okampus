import { PaginationOptions } from '../../../../../shards/types/pagination-options.type';
import { TenantCore } from '@okampus/api/dal';

export class GetProjectsQuery {
  constructor(
    public readonly paginationOptions: PaginationOptions,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}

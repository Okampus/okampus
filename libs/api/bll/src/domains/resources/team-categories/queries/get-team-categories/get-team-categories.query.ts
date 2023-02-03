import { TenantCore } from '@okampus/api/dal';
import { PaginationOptions } from '../../../../../shards/types/pagination-options.type';

export class GetTeamCategoriesQuery {
  constructor(
    public readonly paginationOptions: PaginationOptions,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}

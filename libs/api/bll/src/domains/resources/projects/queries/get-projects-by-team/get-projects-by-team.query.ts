import { PaginationOptions } from '../../../../../shards/types/pagination-options.type';
import { TenantCore } from '@okampus/api/dal';
import { Snowflake } from '@okampus/shared/types';

export class GetProjectsByTeamQuery {
  constructor(
    public readonly teamId: Snowflake,
    public readonly paginationOptions: PaginationOptions,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}

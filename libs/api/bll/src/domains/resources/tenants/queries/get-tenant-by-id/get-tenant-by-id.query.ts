import type { TenantCore } from '@okampus/api/dal';
import type { Snowflake } from '@okampus/shared/types';

export class GetTenantByIdQuery {
  constructor(
    public readonly id: Snowflake,
    public readonly tenant: TenantCore,
    public readonly populate: never[] = <never[]>['tenant']
  ) {}
}

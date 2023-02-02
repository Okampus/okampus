import { TenantCore } from '@okampus/api/dal';
import { Snowflake } from '@okampus/shared/types';

export class GetTenantByIdQuery {
  constructor(
    public readonly id: Snowflake,
    public readonly tenant: TenantCore,
    public readonly populate: never[] = ['tenant'] as never[]
  ) {}
}

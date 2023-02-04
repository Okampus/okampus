import type { TenantCore } from '@okampus/api/dal';
import type { Snowflake } from '@okampus/shared/types';

export class GetUserByIdQuery {
  constructor(
    public readonly id: Snowflake,
    public readonly tenant: TenantCore,
    public readonly populate = ['tenant'] as never[]
  ) {}
}

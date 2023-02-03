import { TenantCore } from '@okampus/api/dal';
import { Snowflake } from '@okampus/shared/types';

export class GetUserByIdQuery {
  constructor(
    public readonly id: Snowflake,
    public readonly tenant: TenantCore,
    public readonly populate = ['tenant'] as never[]
  ) {}
}

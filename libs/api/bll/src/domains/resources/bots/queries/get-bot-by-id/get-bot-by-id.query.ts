import { Snowflake } from '@okampus/shared/types';
import { TenantCore } from '@okampus/api/dal';

export class GetBotByIdQuery {
  constructor(
    public readonly id: Snowflake,
    public readonly tenant: TenantCore,
    public readonly populate: never[] = ['tenant'] as never[]
  ) {}
}

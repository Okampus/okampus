import { Snowflake } from '@okampus/shared/types';
import { TenantCore } from '@okampus/api/dal';

// TODO: add a delete reason and other metadata?
export class DeleteFinanceCommand {
  constructor(public readonly id: Snowflake, public readonly tenant: TenantCore) {}
}

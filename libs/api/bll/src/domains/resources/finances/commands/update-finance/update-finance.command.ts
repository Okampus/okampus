import type { UpdateFinanceDto } from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';

export class UpdateFinanceCommand {
  constructor(
    public readonly updateFinance: UpdateFinanceDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}

import type { CreateFinanceDto } from '@okampus/shared/dtos';
import type { Individual, TenantCore } from '@okampus/api/dal';
import type { MulterFileType } from '@okampus/shared/types';

export class CreateFinanceCommand {
  constructor(
    public readonly createFinance: CreateFinanceDto,
    public readonly requester: Individual,
    public readonly tenant: TenantCore,
    public readonly receipts?: MulterFileType[]
  ) {}
}

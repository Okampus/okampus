import { CreateFinanceDto } from '@okampus/shared/dtos';
import { Individual, TenantCore } from '@okampus/api/dal';
import { MulterFileType } from '@okampus/shared/types';

export class CreateFinanceCommand {
  constructor(
    public readonly createFinance: CreateFinanceDto,
    public readonly requester: Individual,
    public readonly tenant: TenantCore,
    public readonly receipts?: MulterFileType[]
  ) {}
}

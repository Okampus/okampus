import { CreateFinanceCommand } from './create-finance.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { FinanceModel } from '../../../../factories/domains/teams/finance.model';

@CommandHandler(CreateFinanceCommand)
export class CreateFinanceHandler implements ICommandHandler<CreateFinanceCommand> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(command: CreateFinanceCommand): Promise<FinanceModel> {
    return await this.financeFactory.createFinance(command.createFinance, command.requester, command.tenant);
  }
}

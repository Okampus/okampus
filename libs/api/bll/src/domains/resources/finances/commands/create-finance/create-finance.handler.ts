import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';
import type { FinanceModel } from '../../../../factories/domains/teams/finance.model';
import { CreateFinanceCommand } from './create-finance.command';

@CommandHandler(CreateFinanceCommand)
export class CreateFinanceHandler implements ICommandHandler<CreateFinanceCommand> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(command: CreateFinanceCommand): Promise<FinanceModel> {
    return await this.financeFactory.createFinance(command.createFinance, command.requester, command.tenant);
  }
}

import { CreateFinanceCommand } from './create-finance.command';
import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';
import type { FinanceModel } from '../../../../factories/domains/teams/finance.model';

@CommandHandler(CreateFinanceCommand)
export class CreateFinanceHandler implements ICommandHandler<CreateFinanceCommand> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(command: CreateFinanceCommand): Promise<FinanceModel> {
    return await this.financeFactory.createFinance(command.createFinance, command.requester, command.tenant);
  }
}

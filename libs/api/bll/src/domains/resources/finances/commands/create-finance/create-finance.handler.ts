import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';
import { FinanceModel } from '../../../../factories/domains/teams/finance.model';
import { CreateFinanceCommand } from './create-finance.command';

@CommandHandler(CreateFinanceCommand)
export class CreateFinanceHandler implements ICommandHandler<CreateFinanceCommand> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(command: CreateFinanceCommand): Promise<FinanceModel> {
    return await this.financeFactory.createFinance(command.createFinance, command.requester, command.tenant);
  }
}

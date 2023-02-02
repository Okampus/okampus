import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';
import { FinanceModel } from '../../../../factories/domains/teams/finance.model';
import { UpdateFinanceCommand } from './update-finance.command';

@CommandHandler(UpdateFinanceCommand)
export class UpdateFinanceHandler implements ICommandHandler<UpdateFinanceCommand> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(command: UpdateFinanceCommand): Promise<FinanceModel> {
    const { id, ...updateFinance } = command.updateFinance;
    return await this.financeFactory.update({ id, tenant: command.tenant }, command.populate, updateFinance);
  }
}

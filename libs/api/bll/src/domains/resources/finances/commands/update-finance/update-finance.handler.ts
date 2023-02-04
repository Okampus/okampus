import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';
import type { FinanceModel } from '../../../../factories/domains/teams/finance.model';
import { UpdateFinanceCommand } from './update-finance.command';

@CommandHandler(UpdateFinanceCommand)
export class UpdateFinanceHandler implements ICommandHandler<UpdateFinanceCommand> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(command: UpdateFinanceCommand): Promise<FinanceModel> {
    const { id, ...updateFinance } = command.updateFinance;
    return await this.financeFactory.update({ id, tenant: command.tenant }, command.populate, updateFinance);
  }
}

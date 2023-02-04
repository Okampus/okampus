import { DeleteFinanceCommand } from './delete-finance.command';
import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';

@CommandHandler(DeleteFinanceCommand)
export class DeleteFinanceHandler implements ICommandHandler<DeleteFinanceCommand> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(command: DeleteFinanceCommand): Promise<boolean> {
    return await this.financeFactory.delete({ id: command.id, tenant: command.tenant });
  }
}

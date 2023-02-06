import { DeleteFinanceCommand } from './delete-finance.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteFinanceCommand)
export class DeleteFinanceHandler implements ICommandHandler<DeleteFinanceCommand> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(command: DeleteFinanceCommand): Promise<boolean> {
    return await this.financeFactory.delete({ id: command.id, tenant: command.tenant });
  }
}

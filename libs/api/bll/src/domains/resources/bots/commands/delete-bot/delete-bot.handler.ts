import { DeleteBotCommand } from './delete-bot.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BotFactory } from '../../../../factories/domains/bots/bot.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteBotCommand)
export class DeleteBotHandler implements ICommandHandler<DeleteBotCommand> {
  constructor(private readonly botFactory: BotFactory) {}

  async execute(command: DeleteBotCommand): Promise<boolean> {
    return await this.botFactory.delete({ id: command.id, tenant: command.tenant });
  }
}

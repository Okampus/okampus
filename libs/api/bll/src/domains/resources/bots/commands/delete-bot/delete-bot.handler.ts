import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BotFactory } from '../../../../factories/domains/bots/bot.factory';
import { DeleteBotCommand } from './delete-bot.command';

@CommandHandler(DeleteBotCommand)
export class DeleteBotHandler implements ICommandHandler<DeleteBotCommand> {
  constructor(private readonly botFactory: BotFactory) {}

  async execute(command: DeleteBotCommand): Promise<boolean> {
    return await this.botFactory.delete({ id: command.id, tenant: command.tenant });
  }
}

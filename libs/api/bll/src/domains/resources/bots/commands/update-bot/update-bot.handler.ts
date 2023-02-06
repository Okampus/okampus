import { UpdateBotCommand } from './update-bot.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BotFactory } from '../../../../factories/domains/bots/bot.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { BotModel } from '../../../../factories/domains/bots/bot.model';
@CommandHandler(UpdateBotCommand)
export class UpdateBotHandler implements ICommandHandler<UpdateBotCommand> {
  constructor(private readonly botFactory: BotFactory) {}

  async execute(command: UpdateBotCommand): Promise<BotModel> {
    const { id, ...updateBot } = command.updateBot;
    return await this.botFactory.updateActor({ id, tenant: command.tenant }, command.populate, updateBot);
  }
}

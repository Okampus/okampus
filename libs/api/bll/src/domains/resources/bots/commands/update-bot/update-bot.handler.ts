import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { BotFactory } from '../../../../factories/domains/bots/bot.factory';
import type { BotModel } from '../../../../factories/domains/bots/bot.model';
import { UpdateBotCommand } from './update-bot.command';
@CommandHandler(UpdateBotCommand)
export class UpdateBotHandler implements ICommandHandler<UpdateBotCommand> {
  constructor(private readonly botFactory: BotFactory) {}

  async execute(command: UpdateBotCommand): Promise<BotModel> {
    const { id, ...updateBot } = command.updateBot;
    return await this.botFactory.updateActor({ id, tenant: command.tenant }, command.populate, updateBot);
  }
}

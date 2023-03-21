import { CreateBotCommand } from './create-bot.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BotFactory } from '../../../../factories/domains/bots/bot.factory';

import { InjectRepository } from '@mikro-orm/nestjs';
import { CommandHandler } from '@nestjs/cqrs';
import { Actor } from '@okampus/api/dal';

import type { ICommandHandler } from '@nestjs/cqrs';
import type { BaseRepository } from '@okampus/api/dal';
import type { BotModel } from '../../../../factories/domains/bots/bot.model';

@CommandHandler(CreateBotCommand)
export class CreateBotHandler implements ICommandHandler<CreateBotCommand> {
  constructor(
    private readonly botFactory: BotFactory,
    @InjectRepository(Actor) private readonly actorRepository: BaseRepository<Actor>
  ) {}

  async execute(command: CreateBotCommand): Promise<BotModel> {
    return await this.botFactory.createBot({ ...command.createBot, tenant: command.tenant });
  }
}

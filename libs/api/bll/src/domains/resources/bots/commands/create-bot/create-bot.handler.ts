import { CreateBotCommand } from './create-bot.command';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Actor } from '@okampus/api/dal';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { BaseRepository } from '@okampus/api/dal';
import type { BotFactory } from '../../../../factories/domains/bots/bot.factory';
import type { BotModel } from '../../../../factories/domains/bots/bot.model';

@CommandHandler(CreateBotCommand)
export class CreateBotHandler implements ICommandHandler<CreateBotCommand> {
  constructor(
    private readonly botFactory: BotFactory,
    @InjectRepository(Actor) private readonly actorRepository: BaseRepository<Actor>
  ) {}

  async execute(command: CreateBotCommand): Promise<BotModel> {
    // Ensure that slug is unique within the tenant
    const tenant = command.tenant;

    const existingActor = await this.actorRepository.findOne({ slug: command.createBot.slug, tenant });
    if (existingActor) throw new ForbiddenException(`Bot with slug '${command.createBot.slug}'`);

    const owner = await this.actorRepository.findOneOrFail({ slug: command.createBot.ownerSlug, tenant });

    return await this.botFactory.create({ ...command.createBot, owner, tenant });
  }
}

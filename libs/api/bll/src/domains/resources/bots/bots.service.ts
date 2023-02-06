import { CreateBotCommand } from './commands/create-bot/create-bot.command';
import { DeleteBotCommand } from './commands/delete-bot/delete-bot.command';
import { UpdateBotCommand } from './commands/update-bot/update-bot.command';
import { GetBotByIdQuery } from './queries/get-bot-by-id/get-bot-by-id.query';
import { GetBotBySlugQuery } from './queries/get-bot-by-slug/get-bot-by-slug.query';
import { GetBotsQuery } from './queries/get-bots/get-bots.query';
import { RequestContext } from '../../../shards/request-context/request-context';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { CreateBotDto, UpdateDocumentDto } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { PaginatedBotModel, BotModel } from '../../factories/domains/bots/bot.model';

const defaultBotPopulate = ['actor', 'actor.images', 'actor.socials', 'actor.tags'];

@Injectable()
export class BotsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: Snowflake): Promise<BotModel> {
    const query = new GetBotByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultBotPopulate));
    return this.queryBus.execute(query);
  }

  findOneBySlug(slug: Snowflake): Promise<BotModel> {
    const query = new GetBotBySlugQuery(slug, this.tenant(), this.autoGqlPopulate(defaultBotPopulate));
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedBotModel> {
    const query = new GetBotsQuery(paginationOptions, this.tenant(), this.autoGqlPopulate(defaultBotPopulate));
    return this.queryBus.execute(query);
  }

  create(createBot: CreateBotDto): Promise<BotModel> {
    const command = new CreateBotCommand(createBot, this.tenant());
    return this.commandBus.execute(command);
  }

  update(updateBot: UpdateDocumentDto): Promise<BotModel> {
    const command = new UpdateBotCommand(updateBot, this.tenant(), this.autoGqlPopulate(defaultBotPopulate));
    return this.commandBus.execute(command);
  }

  delete(id: Snowflake) {
    const command = new DeleteBotCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}

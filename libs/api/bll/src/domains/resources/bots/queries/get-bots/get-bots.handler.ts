import { GetBotsQuery } from './get-bots.query';
import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler} from '@nestjs/cqrs';
import type { BotFactory } from '../../../../factories/domains/bots/bot.factory';
import type { PaginatedBotModel } from '../../../../factories/domains/bots/bot.model';

@QueryHandler(GetBotsQuery)
export class GetBotsHandler implements IQueryHandler<GetBotsQuery> {
  constructor(private readonly botFactory: BotFactory) {}

  async execute(query: GetBotsQuery): Promise<PaginatedBotModel> {
    return await this.botFactory.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id } },
      { populate: query.populate }
    );
  }
}

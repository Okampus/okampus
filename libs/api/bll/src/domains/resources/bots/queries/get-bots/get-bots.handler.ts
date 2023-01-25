import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BotFactory } from '../../../../factories/bots/bot.factory';
import { PaginatedBotModel } from '../../../../factories/bots/bot.model';
import { GetBotsQuery } from './get-bots.query';

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

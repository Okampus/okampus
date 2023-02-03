import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BotFactory } from '../../../../factories/domains/bots/bot.factory';
import { BotModel } from '../../../../factories/domains/bots/bot.model';
import { GetBotByIdQuery } from './get-bot-by-id.query';

@QueryHandler(GetBotByIdQuery)
export class GetBotByIdHandler implements IQueryHandler<GetBotByIdQuery> {
  constructor(private readonly botFactory: BotFactory) {}

  async execute(query: GetBotByIdQuery): Promise<BotModel> {
    return this.botFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}

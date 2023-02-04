import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { BotFactory } from '../../../../factories/domains/bots/bot.factory';
import type { BotModel } from '../../../../factories/domains/bots/bot.model';
import { GetBotByIdQuery } from './get-bot-by-id.query';

@QueryHandler(GetBotByIdQuery)
export class GetBotByIdHandler implements IQueryHandler<GetBotByIdQuery> {
  constructor(private readonly botFactory: BotFactory) {}

  async execute(query: GetBotByIdQuery): Promise<BotModel> {
    return this.botFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}

import { GetBotByIdQuery } from './get-bot-by-id.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BotFactory } from '../../../../factories/domains/bots/bot.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { BotModel } from '../../../../factories/domains/bots/bot.model';

@QueryHandler(GetBotByIdQuery)
export class GetBotByIdHandler implements IQueryHandler<GetBotByIdQuery> {
  constructor(private readonly botFactory: BotFactory) {}

  async execute(query: GetBotByIdQuery): Promise<BotModel> {
    return this.botFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}

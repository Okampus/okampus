import { GetBotBySlugQuery } from './get-bot-by-slug.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BotFactory } from '../../../../factories/domains/bots/bot.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { BotModel } from '../../../../factories/domains/bots/bot.model';

@QueryHandler(GetBotBySlugQuery)
export class GetBotBySlugHandler implements IQueryHandler<GetBotBySlugQuery> {
  constructor(private readonly botFactory: BotFactory) {}

  async execute(query: GetBotBySlugQuery): Promise<BotModel> {
    const where = { actor: { slug: query.slug }, tenant: { id: query.tenant.id } };
    return this.botFactory.findOneOrFail(where, { populate: query.populate });
  }
}

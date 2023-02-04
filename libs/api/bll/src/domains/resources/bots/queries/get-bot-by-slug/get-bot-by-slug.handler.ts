import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { BotFactory } from '../../../../factories/domains/bots/bot.factory';
import type { BotModel } from '../../../../factories/domains/bots/bot.model';
import { GetBotBySlugQuery } from './get-bot-by-slug.query';

@QueryHandler(GetBotBySlugQuery)
export class GetBotBySlugHandler implements IQueryHandler<GetBotBySlugQuery> {
  constructor(private readonly botFactory: BotFactory) {}

  async execute(query: GetBotBySlugQuery): Promise<BotModel> {
    const where = { actor: { slug: query.slug }, tenant: { id: query.tenant.id } };
    return this.botFactory.findOneOrFail(where, { populate: query.populate });
  }
}

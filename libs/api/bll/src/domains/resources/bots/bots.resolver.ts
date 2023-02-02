import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { BotsService } from './bots.service';
import { CreateBotDto, UpdateDocumentDto } from '@okampus/shared/dtos';
import { PaginatedBotModel, BotModel } from '../../factories/domains/bots/bot.model';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { Snowflake } from '@okampus/shared/types';

@Resolver(() => BotModel)
export class BotsResolver {
  constructor(private readonly botsService: BotsService) {}

  @Query(() => BotModel)
  botById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.botsService.findOneById(id);
  }

  @Query(() => BotModel)
  botBySlug(@Args('slug') slug: string) {
    return this.botsService.findOneBySlug(slug);
  }

  @Query(() => PaginatedBotModel)
  bots(@Args('options', { nullable: true }) options: PaginationOptions) {
    return this.botsService.find(options);
  }

  @Mutation(() => BotModel)
  createBot(@Args('bot') bot: CreateBotDto) {
    return this.botsService.create(bot);
  }

  @Mutation(() => BotModel)
  updateBot(@Args('updateBot') updateBot: UpdateDocumentDto) {
    return this.botsService.update(updateBot);
  }

  @Mutation(() => Boolean)
  deleteBot(@Args('id', { type: () => String }) id: Snowflake) {
    return this.botsService.delete(id);
  }
}

import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsResolver } from './bots.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, Bot } from '@okampus/api/dal';
import { CreateBotHandler } from './commands/create-bot/create-bot.handler';
import { GetBotByIdHandler } from './queries/get-bot-by-id/get-bot-by-id.handler';
import { GetBotsHandler } from './queries/get-bots/get-bots.handler';
import { UpdateBotHandler } from './commands/update-bot/update-bot.handler';
import { DeleteBotHandler } from './commands/delete-bot/delete-bot.handler';
import { GetBotBySlugHandler } from './queries/get-bot-by-slug/get-bot-by-slug.handler';

const commandHandlers = [CreateBotHandler, UpdateBotHandler, DeleteBotHandler];
const queryHandlers = [GetBotByIdHandler, GetBotsHandler, GetBotBySlugHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([Bot, Actor])],
  providers: [BotsResolver, BotsService, ...commandHandlers, ...queryHandlers],
  exports: [BotsService],
})
export class BotsModule {}

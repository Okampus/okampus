import { BotsService } from './bots.service';
import { 
  BotsMutationResolver,
  BotsQueryAggregateResolver, 
  BotsQueryResolver
} from './bots.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Bot } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Bot])],
  providers: [
    BotsMutationResolver,
    BotsQueryResolver, 
    BotsQueryAggregateResolver,
    BotsService
  ],
  exports: [BotsService],
})
export class BotsModule {}
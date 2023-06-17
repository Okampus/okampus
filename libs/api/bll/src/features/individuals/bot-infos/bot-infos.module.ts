import { BotInfosService } from './bot-infos.service';
import { BotInfosMutationResolver, BotInfosQueryAggregateResolver, BotInfosQueryResolver } from './bot-infos.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BotInfo } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([BotInfo])],
  providers: [BotInfosMutationResolver, BotInfosQueryResolver, BotInfosQueryAggregateResolver, BotInfosService],
  exports: [BotInfosService],
})
export class BotInfosModule {}

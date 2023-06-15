import { ActionsService } from './actions.service';
import { ActionsQueryAggregateResolver, ActionsQueryResolver } from './actions.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Action } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Action])],
  providers: [ActionsQueryResolver, ActionsQueryAggregateResolver, ActionsService],
  exports: [ActionsService],
})
export class ActionsModule {}

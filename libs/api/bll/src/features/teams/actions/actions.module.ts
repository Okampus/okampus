import { ActionsService } from './actions.service';
import { ActionsMutationResolver, ActionsQueryAggregateResolver, ActionsQueryResolver } from './actions.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Action } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, MikroOrmModule.forFeature([Action])],
  providers: [ActionsMutationResolver, ActionsQueryResolver, ActionsQueryAggregateResolver, ActionsService],
  exports: [ActionsService],
})
export class ActionsModule {}

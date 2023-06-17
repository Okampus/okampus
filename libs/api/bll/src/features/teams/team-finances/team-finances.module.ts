import { TeamFinancesService } from './team-finances.service';
import {
  TeamFinancesMutationResolver,
  TeamFinancesQueryAggregateResolver,
  TeamFinancesQueryResolver,
} from './team-finances.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamFinance } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TeamFinance])],
  providers: [
    TeamFinancesMutationResolver,
    TeamFinancesQueryResolver,
    TeamFinancesQueryAggregateResolver,
    TeamFinancesService,
  ],
  exports: [TeamFinancesService],
})
export class TeamFinancesModule {}

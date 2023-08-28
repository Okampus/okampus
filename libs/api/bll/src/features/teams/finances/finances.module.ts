import { FinancesService } from './finances.service';
import { 
  FinancesMutationResolver,
  FinancesQueryAggregateResolver, 
  FinancesQueryResolver
} from './finances.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Finance } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Finance])],
  providers: [
    FinancesMutationResolver,
    FinancesQueryResolver, 
    FinancesQueryAggregateResolver,
    FinancesService
  ],
  exports: [FinancesService],
})
export class FinancesModule {}
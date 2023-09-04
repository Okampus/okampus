import { TransactionsService } from './transactions.service';
import {
  TransactionsMutationResolver,
  TransactionsQueryAggregateResolver,
  TransactionsQueryResolver,
} from './transactions.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Transaction } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Transaction])],
  providers: [
    TransactionsMutationResolver,
    TransactionsQueryResolver,
    TransactionsQueryAggregateResolver,
    TransactionsService,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}

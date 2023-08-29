import { ExpenseItemsService } from './expense-items.service';
import {
  ExpenseItemsMutationResolver,
  ExpenseItemsQueryAggregateResolver,
  ExpenseItemsQueryResolver,
} from './expense-items.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ExpenseItem } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([ExpenseItem])],
  providers: [
    ExpenseItemsMutationResolver,
    ExpenseItemsQueryResolver,
    ExpenseItemsQueryAggregateResolver,
    ExpenseItemsService,
  ],
  exports: [ExpenseItemsService],
})
export class ExpenseItemsModule {}

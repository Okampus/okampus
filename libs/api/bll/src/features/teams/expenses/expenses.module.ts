import { ExpensesService } from './expenses.service';
import { ExpensesMutationResolver, ExpensesQueryAggregateResolver, ExpensesQueryResolver } from './expenses.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Expense } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Expense])],
  providers: [ExpensesMutationResolver, ExpensesQueryResolver, ExpensesQueryAggregateResolver, ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}

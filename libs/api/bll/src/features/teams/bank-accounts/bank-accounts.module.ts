import { BankAccountsService } from './bank-accounts.service';
import {
  BankAccountsMutationResolver,
  BankAccountsQueryAggregateResolver,
  BankAccountsQueryResolver
} from './bank-accounts.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BankAccount } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([BankAccount])],
  providers: [
    BankAccountsMutationResolver,
    BankAccountsQueryResolver,
    BankAccountsQueryAggregateResolver,
    BankAccountsService
  ],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
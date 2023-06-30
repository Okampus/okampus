import { AccountsService } from './accounts.service';
import { AccountsMutationResolver, AccountsQueryAggregateResolver, AccountsQueryResolver } from './accounts.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Account } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Account])],
  providers: [AccountsMutationResolver, AccountsQueryResolver, AccountsQueryAggregateResolver, AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}

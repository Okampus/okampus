import { AccountAllocatesService } from './account-allocates.service';
import {
  AccountAllocatesMutationResolver,
  AccountAllocatesQueryAggregateResolver,
  AccountAllocatesQueryResolver,
} from './account-allocates.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccountAllocate } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([AccountAllocate])],
  providers: [
    AccountAllocatesMutationResolver,
    AccountAllocatesQueryResolver,
    AccountAllocatesQueryAggregateResolver,
    AccountAllocatesService,
  ],
  exports: [AccountAllocatesService],
})
export class AccountAllocatesModule {}

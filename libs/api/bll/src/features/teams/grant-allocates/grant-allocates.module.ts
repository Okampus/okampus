import { GrantAllocatesService } from './grant-allocates.service';
import {
  GrantAllocatesMutationResolver,
  GrantAllocatesQueryAggregateResolver,
  GrantAllocatesQueryResolver
} from './grant-allocates.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GrantAllocate } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([GrantAllocate])],
  providers: [
    GrantAllocatesMutationResolver,
    GrantAllocatesQueryResolver,
    GrantAllocatesQueryAggregateResolver,
    GrantAllocatesService
  ],
  exports: [GrantAllocatesService],
})
export class GrantAllocatesModule {}
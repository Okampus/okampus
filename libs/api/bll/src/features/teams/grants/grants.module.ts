import { GrantsService } from './grants.service';
import {
  GrantsMutationResolver,
  GrantsQueryAggregateResolver,
  GrantsQueryResolver
} from './grants.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Grant } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Grant])],
  providers: [
    GrantsMutationResolver,
    GrantsQueryResolver,
    GrantsQueryAggregateResolver,
    GrantsService
  ],
  exports: [GrantsService],
})
export class GrantsModule {}
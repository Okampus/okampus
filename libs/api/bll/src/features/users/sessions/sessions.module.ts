import { SessionsService } from './sessions.service';
import {
  SessionsMutationResolver,
  SessionsQueryAggregateResolver,
  SessionsQueryResolver
} from './sessions.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Session } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Session])],
  providers: [
    SessionsMutationResolver,
    SessionsQueryResolver,
    SessionsQueryAggregateResolver,
    SessionsService
  ],
  exports: [SessionsService],
})
export class SessionsModule {}
import { EventsService } from './events.service';
import { EventsQueryAggregateResolver, EventsQueryResolver } from './events.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { LogsModule } from '../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Event } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Event])],
  providers: [EventsQueryResolver, EventsQueryAggregateResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}

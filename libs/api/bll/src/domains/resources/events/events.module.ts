import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, TenantEvent } from '@okampus/api/dal';
import { CreateEventHandler } from './commands/create-event/create-event.handler';
import { GetEventByIdHandler } from './queries/get-event-by-id/get-event-by-id.handler';
import { UpdateEventHandler } from './commands/update-event/update-event.handler';
import { DeleteEventHandler } from './commands/delete-event/delete-event.handler';
import { GetEventsHandler } from './queries/get-events/get-events.handler';
import { EventsResolver } from './events.resolver';

const commandHandlers = [CreateEventHandler, UpdateEventHandler, DeleteEventHandler];
const queryHandlers = [GetEventByIdHandler, GetEventsHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([TenantEvent, Actor])],
  providers: [EventsResolver, EventsService, ...commandHandlers, ...queryHandlers],
  exports: [EventsService],
})
export class EventsModule {}

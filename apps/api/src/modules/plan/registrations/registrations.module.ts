import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { Event } from '../events/event.entity';
import { EventsModule } from '../events/events.module';
import { EventRegistration } from './registration.entity';
import { EventRegistrationsController } from './registrations.controller';
import { EventRegistrationsResolver } from './registrations.resolver';
import { EventRegistrationsService } from './registrations.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamMember, Event, TeamForm, EventRegistration]),
    NotificationsModule,
    EventsModule,
  ],
  controllers: [EventRegistrationsController],
  providers: [CaslAbilityFactory, EventRegistrationsService, EventRegistrationsResolver],
  exports: [EventRegistrationsService],
})
export class EventRegistrationsModule {}

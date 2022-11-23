import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { TeamEventsModule } from '../events/events.module';
import { TeamEvent } from '../events/team-event.entity';
import { TeamEventRegistrationsController } from './event-registrations.controller';
import { TeamEventRegistrationsResolver } from './event-registrations.resolver';
import { TeamEventRegistrationsService } from './event-registrations.service';
import { TeamEventRegistration } from './team-event-registration.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamMember, TeamEvent, TeamForm, TeamEventRegistration]),
    NotificationsModule,
    TeamEventsModule,
  ],
  controllers: [TeamEventRegistrationsController],
  providers: [CaslAbilityFactory, TeamEventRegistrationsService, TeamEventRegistrationsResolver],
  exports: [TeamEventRegistrationsService],
})
export class TeamEventRegistrationsModule {}

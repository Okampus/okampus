import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@meta/shared/modules/notifications/notifications.module';
import { TeamForm } from '@modules/manage/forms/team-form.entity';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { Team } from '@modules/org/teams/team.entity';
import { ValidationStep } from '@modules/org/tenants/validation-steps/validation-step.entity';
import { User } from '@modules/uua/users/user.entity';
import { TeamEventRegistration } from '../event-registrations/team-event-registration.entity';
import { TeamEventValidationsModule } from '../event-validations/event-validations.module';
import { TeamEventValidation } from '../event-validations/team-event-validation.entity';
import { TeamEventsController } from './events.controller';
import { TeamEventsResolver } from './events.resolver';
import { TeamEventsService } from './events.service';
import { TeamEvent } from './team-event.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Team,
      TeamEvent,
      TeamEventRegistration,
      TeamForm,
      TeamMember,
      User,
      TeamEventValidation,
      ValidationStep,
    ]),
    NotificationsModule,
    TeamEventValidationsModule,
  ],
  controllers: [TeamEventsController],
  providers: [CaslAbilityFactory, TeamEventsService, TeamEventsResolver],
  exports: [TeamEventsService],
})
export class TeamEventsModule {}

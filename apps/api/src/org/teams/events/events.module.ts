import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../../shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '../../../shared/modules/notifications/notifications.module';
import { User } from '../../../uua/users/user.entity';
import { ValidationStep } from '../../tenants/validation-steps/validation-step.entity';
import { TeamEventRegistration } from '../event-registrations/team-event-registration.entity';
import { TeamEventValidationsModule } from '../event-validations/event-validations.module';
import { TeamEventValidation } from '../event-validations/team-event-validation.entity';
import { TeamForm } from '../forms/team-form.entity';
import { TeamMember } from '../members/team-member.entity';
import { Team } from '../teams/team.entity';
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

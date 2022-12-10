import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { EventApprovalsModule } from '@plan/approvals/approvals.module';
import { EventRegistration } from '@plan/registrations/registration.entity';
import { TeamForm } from '@teams/forms/team-form.entity';
import { TeamMember } from '@teams/members/team-member.entity';
import { Team } from '@teams/team.entity';
import { ApprovalStep } from '@tenants/approval-steps/approval-step.entity';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Team,
      Event,
      EventRegistration,
      TeamForm,
      TeamMember,
      ApprovalStep,
    ]),
    NotificationsModule,
    EventApprovalsModule,
  ],
  controllers: [EventsController],
  providers: [CaslAbilityFactory, EventsService, EventsResolver],
  exports: [EventsService],
})
export class EventsModule {}

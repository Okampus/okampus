import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { Team } from '@modules/org/teams/team.entity';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { EventApproval } from '@modules/plan/approvals/approval.entity';
import { EventApprovalsModule } from '@modules/plan/approvals/approvals.module';
import { EventRegistration } from '@modules/plan/registrations/registration.entity';
import { User } from '@modules/uaa/users/user.entity';
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
      User,
      EventApproval,
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

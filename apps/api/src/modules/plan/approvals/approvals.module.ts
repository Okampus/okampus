import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { Event } from '@plan/events/event.entity';
import { ApprovalStep } from '@tenants/approval-steps/approval-step.entity';
import { EventApproval } from './approval.entity';
import { EventApprovalsController } from './approvals.controller';
import { EventApprovalsService } from './approvals.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([ApprovalStep, Event, EventApproval]),
    NotificationsModule,
  ],
  controllers: [EventApprovalsController],
  providers: [CaslAbilityFactory, EventApprovalsService],
  exports: [EventApprovalsService],
})
export class EventApprovalsModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { Event } from '../events/event.entity';
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

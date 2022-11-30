import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { ApprovalStepsController } from '@modules/org/tenants/approval-steps/approval-steps.controller';
import { ApprovalStepsResolver } from '@modules/org/tenants/approval-steps/approval-steps.resolver';
import { ApprovalStepsService } from '@modules/org/tenants/approval-steps/approval-steps.service';

import { EventApproval } from '@modules/plan/approvals/approval.entity';
import { Event } from '@modules/plan/events/event.entity';
import { UsersModule } from '@modules/uaa/users/users.module';
import { TenantsCoreModule } from '../core-tenants.module';
import { ApprovalStep } from './approval-step.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([ApprovalStep, Event, EventApproval]),
    TenantsCoreModule,
    UsersModule,
  ],
  controllers: [ApprovalStepsController],
  providers: [CaslAbilityFactory, ApprovalStepsService, ApprovalStepsResolver],
  exports: [ApprovalStepsService],
})
export class ApprovalStepsModule {}

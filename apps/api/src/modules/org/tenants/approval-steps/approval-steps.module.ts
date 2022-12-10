import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { EventApproval } from '@plan/approvals/approval.entity';
import { Event } from '@plan/events/event.entity';
import { ApprovalStepsController } from '@tenants/approval-steps/approval-steps.controller';
import { ApprovalStepsResolver } from '@tenants/approval-steps/approval-steps.resolver';
import { ApprovalStepsService } from '@tenants/approval-steps/approval-steps.service';
import { TenantsCoreModule } from '@tenants/core-tenants.module';
import { UsersModule } from '@uaa/users/users.module';
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

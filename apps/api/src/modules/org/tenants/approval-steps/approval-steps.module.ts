import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { ApprovalStepsController } from '@modules/org/tenants/approval-steps/approval-steps.controller';
import { ApprovalStepsResolver } from '@modules/org/tenants/approval-steps/approval-steps.resolver';
import { ApprovalStepsService } from '@modules/org/tenants/approval-steps/approval-steps.service';
import { User } from '@modules/uaa/users/user.entity';

import { TenantsCoreModule } from '../core-tenants.module';
import { Tenant } from '../tenant.entity';
import { ApprovalStep } from './approval-step.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([ApprovalStep, Tenant, User]),
    TenantsCoreModule,
  ],
  controllers: [ApprovalStepsController],
  providers: [CaslAbilityFactory, ApprovalStepsService, ApprovalStepsResolver],
  exports: [ApprovalStepsService],
})
export class ApprovalStepsModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { User } from '@modules/uua/users/user.entity';

import { TenantsCoreModule } from '../core-tenants.module';
import { Tenant } from '../tenant.entity';
import { ValidationStep } from './validation-step.entity';
import { ValidationStepsController } from './validation-steps.controller';
import { ValidationStepsResolver } from './validation-steps.resolver';
import { ValidationStepsService } from './validation-steps.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([ValidationStep, Tenant, User]),
    TenantsCoreModule,
  ],
  controllers: [ValidationStepsController],
  providers: [CaslAbilityFactory, ValidationStepsService, ValidationStepsResolver],
  exports: [ValidationStepsService],
})
export class ValidationStepsModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ApprovalStepsModule } from '@modules/org/tenants/approval-steps/approval-steps.module';
import { TenantsCoreModule } from './core-tenants.module';
import { Tenant } from './tenant.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Tenant]),
    RouterModule.register([{
      path: 'tenants',
      children: [
        { path: 'tenants', module: TenantsCoreModule },
        { path: 'approval-steps', module: ApprovalStepsModule },
      ],
    }]),
    TenantsCoreModule,
    ApprovalStepsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TenantsModule {}

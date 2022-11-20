import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { Tenant } from './tenants/tenant.entity';
import { TenantsCoreModule } from './tenants/tenants.module';
import { ValidationStepsModule } from './validation-steps/validation-steps.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Tenant]),
    RouterModule.register([{
      path: 'tenants',
      children: [
        { path: 'tenants', module: TenantsCoreModule },
        { path: 'validation-steps', module: ValidationStepsModule },
      ],
    }]),
    TenantsCoreModule,
    ValidationStepsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TenantsModule {}

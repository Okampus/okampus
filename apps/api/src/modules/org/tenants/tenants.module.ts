import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CaslModule } from '@common/modules/casl/casl.module';
import { ApprovalStepsModule } from '@modules/org/tenants/approval-steps/approval-steps.module';
import { TenantsCoreModule } from './core-tenants.module';
import { TenantImagesModule } from './tenant-images/tenant-images.module';
import { Tenant } from './tenant.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Tenant]),
    RouterModule.register([{
      path: 'tenants',
      children: [
        { path: 'org', module: TenantsCoreModule },
        { path: 'approval-steps', module: ApprovalStepsModule },
        { path: 'images', module: TenantImagesModule },
      ],
    }]),
    TenantsCoreModule,
    ApprovalStepsModule,
    TenantImagesModule,
    CaslModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TenantsModule {}

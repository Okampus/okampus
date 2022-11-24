import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { FileUploadsModule } from '@modules/upload/file-uploads/file-uploads.module';
import { ProfileImage } from '@modules/upload/profile-images/profile-image.entity';
import { ProfileImagesModule } from '@modules/upload/profile-images/profile-images.module';
import { Tenant } from './tenant.entity';
import { TenantsController } from './tenants.controller';
import { TenantsResolver } from './tenants.resolver';
import { TenantsService } from './tenants.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Tenant, ApprovalStep, ProfileImage]),
    FileUploadsModule,
    ProfileImagesModule,
  ],
  controllers: [TenantsController],
  providers: [CaslAbilityFactory, TenantsService, TenantsResolver],
  exports: [TenantsService],
})
export class TenantsCoreModule {}

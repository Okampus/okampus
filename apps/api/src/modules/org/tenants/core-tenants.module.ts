import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { FileUploadsModule } from '@modules/store/file-uploads/file-uploads.module';
import { ProfileImage } from '@modules/store/profile-images/profile-image.entity';
import { ProfileImagesModule } from '@modules/store/profile-images/profile-images.module';
import { Tenant } from './tenant.entity';
import { TenantsController } from './tenants.controller';
import { TenantsResolver } from './tenants.resolver';
import { TenantsService } from './tenants.service';
import { ValidationStep } from './validation-steps/validation-step.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Tenant, ValidationStep, ProfileImage]),
    FileUploadsModule,
    ProfileImagesModule,
  ],
  controllers: [TenantsController],
  providers: [CaslAbilityFactory, TenantsService, TenantsResolver],
  exports: [TenantsService],
})
export class TenantsCoreModule {}

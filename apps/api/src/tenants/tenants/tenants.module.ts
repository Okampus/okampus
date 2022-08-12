import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FileUploadsModule } from '../../files/file-uploads/file-uploads.module';
import { ProfileImage } from '../../files/profile-images/profile-image.entity';
import { ProfileImagesModule } from '../../files/profile-images/profile-images.module';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { ValidationStep } from '../validation-steps/validation-step.entity';
import { Tenant } from './tenant.entity';
import { TenantsController } from './tenants.controller';
import { TenantsResolver } from './tenants.resolver';
import { TenantsService } from './tenants.service';

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

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Tenant } from '@tenants/tenant.entity';
import { FileUploadsModule } from '@upload/file-uploads/file-uploads.module';
import { TenantImage } from './tenant-image.entity';
import { TenantImagesController } from './tenant-images.controller';
import { TenantImagesService } from './tenant-images.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TenantImage, Tenant]),
    FileUploadsModule,
  ],
  controllers: [TenantImagesController],
  providers: [CaslAbilityFactory, TenantImagesService],
  exports: [TenantImagesService],
})
export class TenantImagesModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { User } from '../../users/user.entity';
import { DocSeries } from '../doc-series/doc-series.entity';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { ProfileImage } from './profile-image.entity';
import { ProfileImagesController } from './profile-images.controller';
import { ProfileImagesService } from './profile-images.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([ProfileImage, User, DocSeries]),
    FileUploadsModule,
  ],
  controllers: [ProfileImagesController],
  providers: [CaslAbilityFactory, ProfileImagesService],
  exports: [ProfileImagesService],
})
export class ProfileImagesModule {}

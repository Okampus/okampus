import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { Team } from '../../teams/teams/team.entity';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { GalleryImage } from './gallery-image.entity';
import { GalleriesController } from './gallery.controller';
import { GalleriesService } from './gallery.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([GalleryImage, Team]),
    FileUploadsModule,
  ],
  controllers: [GalleriesController],
  providers: [CaslAbilityFactory, GalleriesService],
  exports: [GalleriesService],
})
export class GalleriesModule {}

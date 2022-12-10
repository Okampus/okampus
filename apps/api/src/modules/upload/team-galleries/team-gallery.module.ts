import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { Team } from '@teams/team.entity';
import { FileUploadsModule } from '@upload/file-uploads/file-uploads.module';
import { TeamGalleriesController } from './team-gallery.controller';
import { TeamGallery } from './team-gallery.entity';
import { TeamGalleriesService } from './team-gallery.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamGallery, Team]),
    FileUploadsModule,
    NotificationsModule,
  ],
  controllers: [TeamGalleriesController],
  providers: [CaslAbilityFactory, TeamGalleriesService],
  exports: [TeamGalleriesService],
})
export class TeamGalleriesModule {}

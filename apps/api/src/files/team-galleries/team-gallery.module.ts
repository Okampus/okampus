import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '../../shared/modules/notifications/notifications.module';
import { Team } from '../../teams/teams/team.entity';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { TeamGallerysController } from './team-gallery.controller';
import { TeamGallery } from './team-gallery.entity';
import { TeamGalleriesService } from './team-gallery.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamGallery, Team]),
    FileUploadsModule,
    NotificationsModule,
  ],
  controllers: [TeamGallerysController],
  providers: [CaslAbilityFactory, TeamGalleriesService],
  exports: [TeamGalleriesService],
})
export class TeamGalleriesModule {}

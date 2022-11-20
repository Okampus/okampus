import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Team } from '../../org/teams/teams/team.entity';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '../../shared/modules/notifications/notifications.module';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
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

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Team } from '../../org/teams/teams/team.entity';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '../../shared/modules/notifications/notifications.module';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { TeamFile } from './team-file.entity';
import { TeamFilesController } from './team-files.controller';
import { TeamFilesService } from './team-files.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamFile, Team]),
    FileUploadsModule,
    NotificationsModule,
  ],
  controllers: [TeamFilesController],
  providers: [CaslAbilityFactory, TeamFilesService],
  exports: [TeamFilesService],
})
export class TeamFilesModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { Team } from '../../teams/teams/team.entity';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { TeamFile } from './team-file.entity';
import { TeamFilesController } from './team-files.controller';
import { TeamFilesService } from './team-files.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamFile, Team]),
    FileUploadsModule,
  ],
  controllers: [TeamFilesController],
  providers: [CaslAbilityFactory, TeamFilesService],
  exports: [TeamFilesService],
})
export class TeamFilesModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { FileUploadsModule } from '@modules/upload/file-uploads/file-uploads.module';
import { Team } from '../team.entity';
import { TeamImage } from './team-image.entity';
import { TeamImagesController } from './team-images.controller';
import { TeamImagesService } from './team-images.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamImage, Team]),
    FileUploadsModule,
  ],
  controllers: [TeamImagesController],
  providers: [CaslAbilityFactory, TeamImagesService],
  exports: [TeamImagesService],
})
export class TeamImagesModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FileUploadsModule } from '../../files/file-uploads/file-uploads.module';
import { ProfileImage } from '../../files/profile-images/profile-image.entity';
import { ProfileImagesModule } from '../../files/profile-images/profile-images.module';
import { TeamFilesModule } from '../../files/team-files/team-files.module';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { User } from '../../users/user.entity';
import { TeamFormsModule } from '../forms/forms.module';
import { TeamForm } from '../forms/team-form.entity';
import { InterestsModule } from '../interests/interests.module';
import { TeamMember } from '../members/team-member.entity';
import { Team } from './team.entity';
import { TeamsController } from './teams.controller';
import { TeamsResolver } from './teams.resolver';
import { TeamsService } from './teams.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamMember, TeamForm, ProfileImage, User]),
    FileUploadsModule,
    ProfileImagesModule,
    TeamFilesModule,
    TeamFormsModule,
    InterestsModule,
  ],
  controllers: [TeamsController],
  providers: [CaslAbilityFactory, TeamsService, TeamsResolver],
  exports: [TeamsService],
})
export class CoreTeamsModule {}

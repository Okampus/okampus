import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Label } from '@modules/catalog/labels/label.entity';
import { TeamFormsModule } from '@modules/org/teams/forms/forms.module';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { User } from '@modules/uaa/users/user.entity';
import { FileUploadsModule } from '@modules/upload/file-uploads/file-uploads.module';
import { ProfileImage } from '@modules/upload/profile-images/profile-image.entity';
import { ProfileImagesModule } from '@modules/upload/profile-images/profile-images.module';
import { TeamFilesModule } from '@modules/upload/team-files/team-files.module';
import { TeamGallery } from '@modules/upload/team-galleries/team-gallery.entity';
import { InterestsModule } from './interests/interests.module';
import { TeamMember } from './members/team-member.entity';
import { Social } from './socials/social.entity';
import { SocialsModule } from './socials/socials.module';
import { Team } from './team.entity';
import { TeamsController } from './teams.controller';
import { TeamsResolver } from './teams.resolver';
import { TeamsService } from './teams.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Team,
      TeamGallery,
      Label,
      TeamMember,
      TeamForm,
      ProfileImage,
      User,
      Social,
    ]),
    FileUploadsModule,
    ProfileImagesModule,
    TeamFilesModule,
    TeamFormsModule,
    InterestsModule,
    SocialsModule,
  ],
  controllers: [TeamsController],
  providers: [CaslAbilityFactory, TeamsService, TeamsResolver],
  exports: [TeamsService],
})
export class CoreTeamsModule {}

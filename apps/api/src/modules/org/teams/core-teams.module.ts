import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Label } from '@catalog/labels/label.entity';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { CaslModule } from '@common/modules/casl/casl.module';
import { TeamFormsModule } from '@teams/forms/forms.module';
import { TeamForm } from '@teams/forms/team-form.entity';
import { User } from '@uaa/users/user.entity';
import { FileUploadsModule } from '@upload/file-uploads/file-uploads.module';
import { TeamFilesModule } from '@upload/team-files/team-files.module';
import { TeamGallery } from '@upload/team-galleries/team-gallery.entity';
import { InterestsModule } from './interests/interests.module';
import { TeamMember } from './members/team-member.entity';
import { Social } from './socials/social.entity';
import { SocialsModule } from './socials/socials.module';
import { TeamImagesModule } from './team-images/team-images.module';
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
      User,
      Social,
    ]),
    CaslModule,
    FileUploadsModule,
    TeamFilesModule,
    TeamFormsModule,
    TeamImagesModule,
    InterestsModule,
    SocialsModule,
  ],
  controllers: [TeamsController],
  providers: [CaslAbilityFactory, TeamsService, TeamsResolver],
  exports: [TeamsService],
})
export class CoreTeamsModule {}

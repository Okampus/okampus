import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { Label } from '@modules/assort/labels/label.entity';
import { TeamForm } from '@modules/manage/forms/team-form.entity';
import { ProfileImage } from '@modules/store/profile-images/profile-image.entity';
import { TeamMember } from '../members/team-member.entity';
import { Social } from '../socials/social.entity';
import { Team } from '../team.entity';
import { TeamsService } from '../teams.service';
import { TeamMembershipRequestsController } from './requests.controller';
import { TeamMembershipRequestsResolver } from './requests.resolver';
import { TeamMembershipRequestsService } from './requests.service';
import { TeamMembershipRequest } from './team-membership-request.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamMember, Label, TeamForm, Social, ProfileImage, TeamMembershipRequest]),
    NotificationsModule,
  ],
  controllers: [TeamMembershipRequestsController],
  providers: [TeamsService, CaslAbilityFactory, TeamMembershipRequestsService, TeamMembershipRequestsResolver],
  exports: [TeamMembershipRequestsService],
})
export class TeamMembershipRequestsModule {}

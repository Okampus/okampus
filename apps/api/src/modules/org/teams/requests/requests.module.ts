import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { CoreTeamsModule } from '../core-teams.module';
import { TeamMember } from '../members/team-member.entity';
import { Team } from '../team.entity';
import { TeamMembershipRequestsController } from './requests.controller';
import { TeamMembershipRequestsResolver } from './requests.resolver';
import { TeamMembershipRequestsService } from './requests.service';
import { TeamMembershipRequest } from './team-membership-request.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Team,
      TeamMember,
      TeamForm,
      TeamMembershipRequest,
    ]),
    NotificationsModule,
    CoreTeamsModule,
  ],
  controllers: [TeamMembershipRequestsController],
  providers: [CaslAbilityFactory, TeamMembershipRequestsService, TeamMembershipRequestsResolver],
  exports: [TeamMembershipRequestsService],
})
export class TeamMembershipRequestsModule {}

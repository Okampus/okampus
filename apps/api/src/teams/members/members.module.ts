import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '../../shared/modules/notifications/notifications.module';
import { User } from '../../users/user.entity';
import { TeamMembershipRequestsModule } from '../requests/requests.module';
import { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { Team } from '../teams/team.entity';
import { TeamMembersController } from './members.controller';
import { TeamMembersResolver } from './members.resolver';
import { TeamMembersService } from './members.service';
import { TeamMember } from './team-member.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamMember, TeamMembershipRequest, User]),
    NotificationsModule,
    TeamMembershipRequestsModule,
  ],
  controllers: [TeamMembersController],
  providers: [CaslAbilityFactory, TeamMembersService, TeamMembersResolver],
  exports: [TeamMembersService],
})
export class TeamMembersModule {}

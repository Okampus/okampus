import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { User } from '../../users/user.entity';
import { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { Team } from '../teams/team.entity';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { TeamMember } from './team-member.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamMember, TeamMembershipRequest, User]),
  ],
  controllers: [MembersController],
  providers: [CaslAbilityFactory, MembersService],
  exports: [MembersService],
})
export class MembersModule {}

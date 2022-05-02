import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { TeamMember } from '../members/team-member.entity';
import { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamMember, TeamMembershipRequest]),
  ],
  controllers: [MembershipsController],
  providers: [CaslAbilityFactory, MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}

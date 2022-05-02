import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { TeamMember } from '../members/team-member.entity';
import { Team } from '../teams/team.entity';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { TeamMembershipRequest } from './team-membership-request.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamMember, TeamMembershipRequest]),
  ],
  controllers: [RequestsController],
  providers: [CaslAbilityFactory, RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}

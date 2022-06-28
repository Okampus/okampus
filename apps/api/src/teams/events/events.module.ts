import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { User } from '../../users/user.entity';
import { TeamMember } from '../members/team-member.entity';
import { Team } from '../teams/team.entity';
import { TeamEventsController } from './events.controller';
import { TeamEventsService } from './events.service';
import { TeamEvent } from './team-event.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamMember, TeamEvent, User]),
  ],
  controllers: [TeamEventsController],
  providers: [CaslAbilityFactory, TeamEventsService],
  exports: [TeamEventsService],
})
export class TeamEventsModule {}

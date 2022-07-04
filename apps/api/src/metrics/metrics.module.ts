import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamEvent } from '../teams/events/team-event.entity';
import { TeamMember } from '../teams/members/team-member.entity';
import { Team } from '../teams/teams/team.entity';
import { User } from '../users/user.entity';
import { Metric } from './metric.entity';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, Metric, TeamMember, TeamEvent, User]),
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { Team } from '@modules/org/teams/team.entity';
import { Event } from '@modules/plan/events/event.entity';
import { User } from '@modules/uaa/users/user.entity';
import { Metric } from './metric.entity';
import { MetricsController } from './metrics.controller';
import { MetricsResolver } from './metrics.resolver';
import { MetricsService } from './metrics.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, Metric, TeamMember, Event, User]),
  ],
  controllers: [MetricsController],
  providers: [MetricsService, MetricsResolver],
  exports: [MetricsService],
})
export class MetricsModule {}

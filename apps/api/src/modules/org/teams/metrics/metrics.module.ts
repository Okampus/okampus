import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Event } from '@plan/events/event.entity';
import { TeamMember } from '@teams/members/team-member.entity';
import { Team } from '@teams/team.entity';
import { User } from '@uaa/users/user.entity';
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

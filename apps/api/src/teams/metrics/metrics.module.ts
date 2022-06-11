import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { TeamEvent } from '../events/team-event.entity';
import { TeamMember } from '../members/team-member.entity';
import { Team } from '../teams/team.entity';
import { TeamMetricsController } from './metrics.controller';
import { TeamMetricsService } from './metrics.service';
import { TeamMetric } from './team-metric.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamMetric, TeamMember, TeamEvent]),
  ],
  controllers: [TeamMetricsController],
  providers: [CaslAbilityFactory, TeamMetricsService],
  exports: [TeamMetricsService],
})
export class TeamMetricsModule {}

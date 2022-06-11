import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { ListTeamMetricsDto } from './dto/list-team-metrics.dto';
import { TeamMetricsService } from './metrics.service';
import { TeamMetric } from './team-metric.entity';

@ApiTags('Team Metrics')
@Controller()
export class TeamMetricsController {
  constructor(
    private readonly metricsService: TeamMetricsService,
  ) {}

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamMetric))
  public async findAll(
    @Query() query: ListTeamMetricsDto,
  ): Promise<TeamMetric[]> {
    return await this.metricsService.findAll(query);
  }
}

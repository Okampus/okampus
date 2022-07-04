import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { ListMetricsDto } from './dto/list-metrics.dto';
import { Metric } from './metric.entity';
import { MetricsService } from './metrics.service';

@ApiTags('Metrics')
@Controller({ path: 'metrics' })
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
  ) {}

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Metric))
  public async findAll(
    @Query() query: ListMetricsDto,
  ): Promise<Metric[]> {
    return await this.metricsService.findAll(query);
  }
}

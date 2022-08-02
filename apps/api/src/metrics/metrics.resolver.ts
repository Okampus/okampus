import {
  Args,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { ListMetricsDto } from './dto/list-metrics.dto';
import { Metric } from './metric.entity';
import { MetricsService } from './metrics.service';

@Resolver(() => Metric)
export class MetricsResolver {
  constructor(
    private readonly metricsService: MetricsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [Metric])
  public async metrics(@Args('metrics') metrics: ListMetricsDto): Promise<Metric[]> {
    return await this.metricsService.findAll(metrics);
  }
}

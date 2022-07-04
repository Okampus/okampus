import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { config } from '../shared/configs/config';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { MetricName } from '../shared/lib/types/enums/metric-name.enum';
import { TeamKind } from '../shared/lib/types/enums/team-kind.enum';
import { TeamEvent } from '../teams/events/team-event.entity';
import { TeamMember } from '../teams/members/team-member.entity';
import { Team } from '../teams/teams/team.entity';
import type { ListMetricsDto } from './dto/list-metrics.dto';
import { Metric } from './metric.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metric) private readonly metricRepository: BaseRepository<Metric>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamEvent) private readonly teamEventRepository: BaseRepository<TeamEvent>,
  ) {}

  @Cron(config.get('settings.metricsCron'))
  public async updateMetrics(): Promise<void> {
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    const metrics: Array<ConstructorParameters<typeof Metric>[0]> = [];

    // ClubCount
    const clubCount = await this.teamRepository.count({ kind: TeamKind.Club });
    metrics.push({ name: MetricName.ClubCount, value: clubCount });

    // ClubMembershipCount
    const membershipCount = await this.teamMemberRepository.count({ team: { kind: TeamKind.Club } });
    metrics.push({ name: MetricName.ClubMembershipCount, value: membershipCount });

    // ClubUniqueMembershipCount
    const [{ count }] = await this.teamMemberRepository
      .createQueryBuilder()
      .count('user', true)
      .execute() as [col: { count: string }];
    metrics.push({ name: MetricName.ClubUniqueMembershipCount, value: Number(count) || 0 });

    // ClubEventCount
    const eventCount = await this.teamEventRepository.count({
      team: { kind: TeamKind.Club },
      $and: [
        { start: { $gt: fifteenMinutesAgo } },
        { start: { $lte: new Date() } },
      ],
    });
    metrics.push({ name: MetricName.ClubEventCount, value: eventCount });

    // ClubCreatedEventCount
    const createdEventCount = await this.teamEventRepository.count({
      team: { kind: TeamKind.Club },
      $and: [
        { createdAt: { $gt: fifteenMinutesAgo } },
        { createdAt: { $lte: new Date() } },
      ],
    });
    metrics.push({ name: MetricName.ClubCreatedEventCount, value: createdEventCount });

    await this.metricRepository.persistAndFlush(metrics.map(opts => new Metric(opts)));
  }

  public async findAll(query: ListMetricsDto): Promise<Metric[]> {
    let filters = {};

    if (query.before)
      filters = { ...filters, $lt: query.before };
    if (query.after) {
      filters = { ...filters, $gt: query.after };
    } else {
      const oneMonthAgo = new Date();
      oneMonthAgo.setHours(0, 0, 0, 0);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filters = { ...filters, $gt: oneMonthAgo };
    }

    const metrics = await this.metricRepository.find(
      { createdAt: filters, name: query.name },
      { orderBy: { createdAt: 'ASC' } },
    );

    if (!query.interval)
      return metrics;

    const start = metrics[0].createdAt;
    const end = metrics[metrics.length - 1].createdAt;
    start.setSeconds(0, 0);
    end.setSeconds(0, 0);

    const result = [];
    for (let cursor = start.getTime(); cursor < end.getTime(); cursor += query.interval * 1000) {
      const item = metrics.find((metric) => {
        const roundedDate = new Date(metric.createdAt);
        roundedDate.setSeconds(0, 0);
        return roundedDate.getTime() === cursor;
      });
      if (item)
        result.push(item);
    }
    return result;
  }
}

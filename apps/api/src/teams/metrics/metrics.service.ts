import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { config } from '../../shared/configs/config';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { TeamKind } from '../../shared/lib/types/enums/team-kind.enum';
import { TeamMetricName } from '../../shared/lib/types/enums/team-metric-type.enum';
import { TeamEvent } from '../events/team-event.entity';
import { TeamMember } from '../members/team-member.entity';
import { Team } from '../teams/team.entity';
import type { ListTeamMetricsDto } from './dto/list-team-metrics.dto';
import { TeamMetric } from './team-metric.entity';

@Injectable()
export class TeamMetricsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMetric) private readonly teamMetricRepository: BaseRepository<TeamMetric>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamEvent) private readonly teamEventRepository: BaseRepository<TeamEvent>,
  ) {}

  @Cron(config.get('settings.teamMetricsCron'))
  public async updateMetrics(): Promise<void> {
    const isClub = { team: { kind: TeamKind.Club } };

    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    const metrics: Array<ConstructorParameters<typeof TeamMetric>[0]> = [];

    // ClubCount
    const clubCount = await this.teamRepository.count({ kind: TeamKind.Club });
    metrics.push({ name: TeamMetricName.ClubCount, value: clubCount });

    // MembershipCount
    const membershipCount = await this.teamMemberRepository.count(isClub);
    metrics.push({ name: TeamMetricName.MembershipCount, value: membershipCount });

    // UniqueMembershipCount
    const [{ count }] = await this.teamMemberRepository
      .createQueryBuilder()
      .count('user', true)
      .execute() as [col: { count: string }];
    metrics.push({ name: TeamMetricName.UniqueMembershipCount, value: Number(count) || 0 });

    // EventCount
    const eventCount = await this.teamEventRepository.count({
      ...isClub,
      $and: [
        { start: { $gt: fifteenMinutesAgo } },
        { start: { $lte: new Date() } },
      ],
    });
    metrics.push({ name: TeamMetricName.EventCount, value: eventCount });

    // CreatedEventCount
    const createdEventCount = await this.teamEventRepository.count({
      ...isClub,
      $and: [
        { createdAt: { $gt: fifteenMinutesAgo } },
        { createdAt: { $lte: new Date() } },
      ],
    });
    metrics.push({ name: TeamMetricName.CreatedEventCount, value: createdEventCount });

    await this.teamMetricRepository.persistAndFlush(metrics.map(opts => new TeamMetric(opts)));
  }

  public async findAll(query: ListTeamMetricsDto): Promise<TeamMetric[]> {
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

    const metrics = await this.teamMetricRepository.find(
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

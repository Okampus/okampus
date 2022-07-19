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
import { User } from '../users/user.entity';
import type { ListMetricsDto } from './dto/list-metrics.dto';
import type { MetricSlim } from './metric.entity';
import { Metric } from './metric.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metric) private readonly metricRepository: BaseRepository<Metric>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamEvent) private readonly teamEventRepository: BaseRepository<TeamEvent>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) {}

  @Cron(config.get('settings.metricsCron'))
  public async updateMetrics(): Promise<void> {
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    const metrics: Array<Omit<ConstructorParameters<typeof Metric>[0], 'createdAt'>> = [];

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

    // UserCount
    const userCount = await this.userRepository.count();
    metrics.push({ name: MetricName.UserCount, value: userCount });

    const roundedDate = new Date();
    roundedDate.setSeconds(0, 0);

    await this.metricRepository.persistAndFlush(
      metrics.map(opts => new Metric({ ...opts, createdAt: roundedDate })),
    );
  }

  public async findAll(query: ListMetricsDto): Promise<MetricSlim[]> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setHours(0, 0, 0, 0);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const dateLowerBound = (query.after ?? oneMonthAgo).toISOString();
    const dateUpperBound = (query.before ?? new Date()).toISOString();
    const interval = `${query.interval ?? 'PT15M'}`;

    const knex = this.metricRepository.getKnex();

    return await knex
      .select('metric.created_at', 'metric.value', 'metric.name')
      .from(knex.raw(
        `generate_series(timestamptz '${dateLowerBound}', timestamptz '${dateUpperBound}', '${interval}'::interval) pool (interval)`,
      ))
      .innerJoin('metric', 'metric.created_at', 'pool.interval')
      .whereIn('metric.name', query.names) as MetricSlim[];
  }
}

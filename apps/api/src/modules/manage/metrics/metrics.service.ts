import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { config } from '@common/configs/config';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { MetricName } from '@common/lib/types/enums/metric-name.enum';
import { TeamKind } from '@common/lib/types/enums/team-kind.enum';
import { oneMonthAgo, roundToInterval } from '@common/lib/utils/date-utils';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { Team } from '@modules/org/teams/team.entity';
import { TeamEvent } from '@modules/plan/events/team-event.entity';
import { User } from '@modules/uua/users/user.entity';
import type { ListMetricsDto } from './dto/list-metrics.dto';
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

  @Cron(config.settings.metricsCron)
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

  public async findAll(query: ListMetricsDto): Promise<Metric[]> {
    const interval = `${query.interval ?? 'PT15M'}`;
    const dateLowerBound = (roundToInterval(query.after ?? oneMonthAgo(new Date()), interval)).toISOString();
    const dateUpperBound = (query.before ?? new Date()).toISOString();

    const knex = this.metricRepository.getKnex();

    return await knex
      .select('metric.created_at as createdAt', 'metric.value', 'metric.name')
      .from(knex.raw(
        `generate_series(timestamptz '${dateLowerBound}', timestamptz '${dateUpperBound}', '${interval}'::interval) pool (interval)`,
      ))
      .innerJoin('metric', 'metric.created_at', 'pool.interval')
      .whereIn('metric.name', query.names) as Metric[];
  }
}

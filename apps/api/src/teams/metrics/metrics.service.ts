import type { FilterQuery } from '@mikro-orm/core';
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

    const pushMetric = await this.metricSaverFactory();

    // ClubCount
    const clubCount = await this.teamRepository.count({ kind: TeamKind.Club });
    pushMetric(TeamMetricName.ClubCount, clubCount);

    // MembershipCount
    const membershipCount = await this.teamMemberRepository.count(isClub);
    pushMetric(TeamMetricName.MembershipCount, membershipCount);

    // UniqueMembershipCount
    const [uniqueMembershipCount] = await this.teamMemberRepository
      .createQueryBuilder()
      .count('user', true)
      .execute() as [col: { count: string }];
    pushMetric(TeamMetricName.UniqueMembershipCount, Number(uniqueMembershipCount.count));

    // EventCount
    const eventCount = await this.teamEventRepository.count({
      ...isClub,
      $and: [
        { start: { $gt: fifteenMinutesAgo } },
        { start: { $lte: new Date() } },
      ],
    });
    pushMetric(TeamMetricName.EventCount, eventCount);

    // CreatedEventCount
    const createdEventCount = await this.teamEventRepository.count({
      ...isClub,
      $and: [
        { createdAt: { $gt: fifteenMinutesAgo } },
        { createdAt: { $lte: new Date() } },
      ],
    });
    pushMetric(TeamMetricName.CreatedEventCount, createdEventCount);

    await this.teamMetricRepository.flush();
  }

  public async findAll(query: ListTeamMetricsDto): Promise<TeamMetric[]> {
    const filters: FilterQuery<TeamMetric> = { name: query.name };
    if (query.before)
      filters.createdAt = { $lt: query.before };
    if (query.after) {
      filters.createdAt = { $gt: query.after };
    } else {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filters.createdAt = { $gt: oneMonthAgo };
    }

    return await this.teamMetricRepository.find(
      { name: query.name },
      { orderBy: { createdAt: 'ASC' } },
    );
  }

  private async metricSaverFactory(): Promise<(name: TeamMetricName, value: number) => void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysMetrics = await this.teamMetricRepository.find({
      createdAt: { $gt: today },
    });

    return (name: TeamMetricName, value: number): void => {
      const metric = todaysMetrics.find(m => m.name === name);
      if (metric) {
        metric.dayValues.push(value);
      } else {
        const newMetric = new TeamMetric({ name, value });
        this.teamMetricRepository.persist(newMetric);
      }
    };
  }
}

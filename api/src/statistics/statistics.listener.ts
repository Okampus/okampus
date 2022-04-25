import { MikroORM } from '@mikro-orm/core';
import { InjectRepository, UseRequestContext } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BadgeUnlock } from '../badges/entities/badge-unlock.entity';
import { Badge } from '../badges/entities/badge.entity';
import { Content } from '../contents/entities/content.entity';
import type { InfoDoc } from '../files/info-docs/info-doc.entity';
import type { StudyDoc } from '../files/study-docs/study-doc.entity';
import pointsConfig from '../shared/configs/points.config';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { ContentKind } from '../shared/lib/types/enums/content-kind.enum';
import { Statistic } from '../shared/lib/types/enums/statistic.enum';
import { isYesterday } from '../shared/lib/utils/date-utils';
import { User } from '../users/user.entity';
import { Statistics } from './statistics.entity';

@Injectable()
export class StatisticsListener {
  constructor(
    @InjectRepository(Statistics) private readonly statisticsRepository: BaseRepository<Statistics>,
    @InjectRepository(Badge) private readonly badgeRepository: BaseRepository<Badge>,
    @InjectRepository(BadgeUnlock) private readonly badgeUnlockRepository: BaseRepository<BadgeUnlock>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,

    private readonly orm: MikroORM,
  ) {}

  @OnEvent('content.created')
  @UseRequestContext()
  public async onContentCreated(content: Content): Promise<void> {
    const stats = await this.statisticsRepository.findOne({ user: content.author }, { populate: ['user'] });
    if (stats) {
      switch (content.kind) {
        case ContentKind.Post:
          stats.postCount++;
          stats.user.points += pointsConfig.post;
          if (stats.postStreak === 0 || isYesterday(stats.lastPost!))
            stats.postStreak++;
          stats.lastPost = new Date();

          await this.registerAction(stats, Statistic.Post);
          break;
        case ContentKind.Reply:
          stats.replyCount++;
          stats.user.points += pointsConfig.reply;
          if (stats.replyStreak === 0 || isYesterday(stats.lastReply!))
            stats.replyStreak++;
          stats.lastReply = new Date();

          await this.registerAction(stats, Statistic.Reply);
          break;
        case ContentKind.Comment:
          stats.commentCount++;
          stats.user.points += pointsConfig.comment;
          if (stats.commentStreak === 0 || isYesterday(stats.lastComment!))
            stats.commentStreak++;
          stats.lastComment = new Date();

          await this.registerAction(stats, Statistic.Comment);
          break;
      }
    }
  }

  @OnEvent('document.created')
  @UseRequestContext()
  public async onDocumentCreated(document: InfoDoc | StudyDoc): Promise<void> {
    const stats = await this.statisticsRepository.findOne({ user: document.file.user }, { populate: ['user'] });
    if (stats) {
      stats.uploadCount++;
      stats.user.points += pointsConfig.upload;
      await this.registerAction(stats, Statistic.Upload);
    }
  }

  private async registerAction(stats: Statistics, statistic: Statistic): Promise<void> {
    if (!stats.lastAction || isYesterday(stats.lastAction))
      stats.actionStreak++;
    stats.lastAction = new Date();

    const badgeUnlocked = await this.badgeUnlockRepository.find({ user: stats.user, badge: { statistic } });
    // TODO: Add heavy cache here
    const badges = await this.badgeRepository.find({
      statistic,
      statisticThreshold: { $lte: stats[`${statistic}Count`] },
      $nin: badgeUnlocked.map(badge => badge.badge),
    });

    const toBeUnlocked: BadgeUnlock[] = [];
    for (const badge of badges) {
      stats.user.points += badge.pointPrize;
      toBeUnlocked.push(new BadgeUnlock({ user: stats.user, badge }));
    }

    if (toBeUnlocked.length > 0)
      await this.badgeUnlockRepository.persistAndFlush(toBeUnlocked);

    await this.statisticsRepository.flush();
    await this.userRepository.flush();
  }
}

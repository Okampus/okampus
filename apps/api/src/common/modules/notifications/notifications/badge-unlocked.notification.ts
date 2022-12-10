import type { ITriggerPayload } from '@novu/node';
import { NotificationType } from '@common/modules/notifications/notification-type.enum';
import { BadgeUnlock } from '@uaa/badges/entities/badge-unlock.entity';
import type { User } from '@uaa/users/user.entity';
import { Notification } from './base.notification';

export class BadgeUnlockedNotification extends Notification {
  public readonly type = NotificationType.BadgeUnlocked;
  public readonly settingName = 'notificationBadgeUnlocked';

  constructor(
    private readonly badgeUnlock: BadgeUnlock,
  ) {
    super();
  }

  public getNotifiees(): Set<User> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    return this.filter(this.badgeUnlock.user);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(BadgeUnlock).populate(
      this.badgeUnlock,
      ['badge', 'user'],
    );
  }

  public getPayload(user: User): ITriggerPayload {
    return {
      recipient: this.userToPayload(user),
      badge: {
        name: this.badgeUnlock.badge.name,
        description: this.badgeUnlock.badge.description,
        pointPrize: this.badgeUnlock.badge.pointPrize,
        level: this.badgeUnlock.badge.level,
        icon: this.badgeUnlock.badge.icon,
        series: this.badgeUnlock.badge.series,
        statistic: this.badgeUnlock.badge.statistic,
        statisticThreshold: this.badgeUnlock.badge.statisticThreshold,
      },
    };
  }
}

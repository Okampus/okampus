import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Embedded, Entity, OneToOne, Property } from '@mikro-orm/core';
import { UserCustomization, UserStats } from '@okampus/shared/dtos';
import { UserNotificationSettings } from '@okampus/shared/dtos';
import { UserSettings } from '@okampus/shared/dtos';
import type { User } from '../user/user.entity';
import type { UserProfileOptions } from './user-profile.options';

@Entity()
export class UserProfile extends TenantScopedEntity {
  @Embedded(() => UserCustomization)
  customization = new UserCustomization({});

  @Embedded(() => UserStats)
  stats = new UserStats({});

  @Embedded(() => UserSettings)
  settings = new UserSettings({});

  @Embedded(() => UserNotificationSettings)
  notificationSettings = new UserNotificationSettings({});

  @Property({ type: 'boolean' })
  finishedIntroduction = false;

  @Property({ type: 'boolean' })
  finishedOnboarding = false;

  @OneToOne({ type: 'User', mappedBy: 'profile' })
  user!: User;

  constructor(options: UserProfileOptions) {
    super({ tenant: options.user.tenant });
    this.assign(options);
  }
}

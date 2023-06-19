import { UserInfoRepository } from './user-info.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Collection, Embedded, Entity, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { UserCustomization, UserStats, UserSettings, UserNotificationSettings } from '@okampus/shared/dtos';

import type { UserInfoOptions } from './user-info.options';
import type { Individual } from '../individual.entity';
import type { Shortcut } from '../shortcut/shortcut.entity';
import type { Session } from '../session/session.entity';
import type { TeamJoin } from '../../team/team-join/team-join.entity';
import type { TeamMember } from '../../team/team-member/team-member.entity';

@Entity({ customRepository: () => UserInfoRepository })
export class UserInfo extends TenantScopedEntity {
  @Property({ type: 'text' })
  firstName!: string;

  @Property({ type: 'array' })
  middleNames: string[] = [];

  @Property({ type: 'text' })
  lastName!: string;

  @OneToMany({ type: 'Shortcut', mappedBy: 'user' })
  @TransformCollection()
  shortcuts = new Collection<Shortcut>(this);

  @OneToMany({ type: 'Session', mappedBy: 'user' })
  @TransformCollection()
  sessions = new Collection<Session>(this);

  // @OneToMany('Interest', 'user')
  // @TransformCollection()
  // interests = new Collection<Interest>(this);

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

  @OneToOne({ type: 'Individual', mappedBy: 'user' })
  individual!: Individual;

  @OneToMany({ type: 'TeamMember', mappedBy: 'user' })
  @TransformCollection()
  teamMemberships = new Collection<TeamMember>(this);

  @OneToMany({ type: 'TeamJoin', mappedBy: 'joiner' })
  @TransformCollection()
  teamJoins = new Collection<TeamJoin>(this);

  constructor(options: UserInfoOptions) {
    super(options);
    this.assign(options);
  }
}

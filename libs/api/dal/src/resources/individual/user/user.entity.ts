import { UserRepository } from './user.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Collection, Entity, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

import type { UserOptions } from './user.options';
import type { Individual } from '../individual.entity';
import type { Shortcut } from '../shortcut/shortcut.entity';
import type { Session } from '../session/session.entity';
import type { TeamJoin } from '../../team/team-join/team-join.entity';
import type { TeamMember } from '../../team/team-member/team-member.entity';

@Entity({ customRepository: () => UserRepository })
export class User extends TenantScopedEntity {
  @Property({ type: 'text' })
  firstName!: string;

  @Property({ type: 'array', default: [] })
  middleNames: string[] = [];

  @Property({ type: 'text' })
  lastName!: string;

  @Property({ type: 'float', default: 0 })
  points = 0;

  // @OneToMany('Interest', 'user')
  // @TransformCollection()
  // interests = new Collection<Interest>(this);

  //// User session settings
  @Property({ type: 'boolean', default: false })
  isOnboardingFinished = false;

  @Property({ type: 'boolean', default: false })
  isIntroductionFinished = false;

  @Property({ type: 'boolean', default: false })
  isDarkModePreferred = false;

  /** Export my data via the main email when my account is deactivated */
  @Property({ type: 'boolean', default: true })
  isDataExportedOnDeactivation = true;

  /** Anonymize my data when my account is deactivated */
  @Property({ type: 'boolean', default: false })
  isDataAnonymizedOnDeactivation = false;
  ////

  @OneToOne({ type: 'Individual', inversedBy: 'user' })
  individual!: Individual;

  @OneToMany({ type: 'TeamMember', mappedBy: 'user' })
  @TransformCollection()
  teamMemberships = new Collection<TeamMember>(this);

  @OneToMany({ type: 'TeamJoin', mappedBy: 'joinedBy' })
  @TransformCollection()
  teamJoins = new Collection<TeamJoin>(this);

  @OneToMany({ type: 'Shortcut', mappedBy: 'user' })
  @TransformCollection()
  shortcuts = new Collection<Shortcut>(this);

  @OneToMany({ type: 'Session', mappedBy: 'user' })
  @TransformCollection()
  sessions = new Collection<Session>(this);

  constructor(options: UserOptions) {
    super(options);
    this.assign(options);
  }
}

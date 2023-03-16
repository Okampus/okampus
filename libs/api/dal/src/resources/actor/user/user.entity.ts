import { UserRepository } from './user.repository';
import { Individual } from '../individual/individual.entity';
import { UserProfile } from '../user-profile/user-profile.entity';
import { Collection, Entity, EntityRepositoryType, Enum, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { RoleType } from '@okampus/shared/enums';
import { ScopeRole } from '@okampus/shared/enums';
import { IndividualKind } from '@okampus/shared/enums';
import { fullName } from '@okampus/shared/utils';
import { TransformCollection } from '@okampus/api/shards';

import type { Searchable } from '../../../types/search-entity.type';
import type { UserOptions } from './user.options';
import type { Session } from '../../manage-user/session/session.entity';
import type { TeamMember } from '../../membership/team-member/team-member.entity';
import type { Shortcut } from '../shortcut/shortcut.entity';
import type { TeamJoin } from '../../join/team-join/team-join.entity';

@Entity({ customRepository: () => UserRepository })
export class User extends Individual implements Searchable {
  [EntityRepositoryType]!: UserRepository;

  @Property({ type: 'text' })
  firstName!: string;

  @Property({ type: 'array' })
  middleNames: string[] = [];

  @Property({ type: 'text' })
  lastName!: string;

  @Property({ type: 'text', hidden: true, nullable: true })
  passwordHash: string | null = null;

  // Roles
  @Enum({ items: () => RoleType, type: 'string', default: [RoleType.User], array: true })
  roles = [RoleType.User];

  @Enum({ items: () => ScopeRole, type: 'string' })
  scopeRole!: ScopeRole;

  @OneToOne({ type: 'UserProfile', inversedBy: 'user' })
  profile = new UserProfile({ user: this });

  @OneToMany({ type: 'Shortcut', mappedBy: 'user' })
  @TransformCollection()
  shortcuts = new Collection<Shortcut>(this);

  // @OneToMany('BadgeUnlock', 'user')
  // badgesUnlocked = new Collection<BadgeUnlock>(this);

  @OneToMany({ type: 'Session', mappedBy: 'user' })
  @TransformCollection()
  sessions = new Collection<Session>(this);

  // @OneToMany('ClassMembership', 'user')
  // classMemberships = new Collection<ClassMembership>(this);

  // @OneToMany('TeamMembershipRequest', 'user')
  // teamMembershipRequests = new Collection<TeamMembershipRequest>(this);

  @OneToMany({ type: 'TeamMember', mappedBy: 'user' })
  @TransformCollection()
  teamMemberships = new Collection<TeamMember>(this);

  @OneToMany({ type: 'TeamJoin', mappedBy: 'joiner' })
  @TransformCollection()
  teamJoins = new Collection<TeamJoin>(this);

  // @OneToMany('Interest', 'user')
  // interests = new Collection<Interest>(this);

  constructor(options: UserOptions) {
    const name = fullName(options.firstName, options.lastName);

    super({ ...options, name, individualKind: IndividualKind.User });
    this.assign({ ...options, individualKind: IndividualKind.User });
  }

  public getFullName(): string {
    return `${this.actor.name} ${this.lastName}`;
  }

  public getCompleteFullName(): string {
    return [this.actor.name, ...this.middleNames, this.lastName].join(' ');
  }
}

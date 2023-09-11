import { UserRepository } from './user.repository';
import { TenantScopedEntity } from '..';
import { Actor } from '../actor/actor.entity';
import { Collection, Entity, EntityRepositoryType, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

import { toSlug, randomId } from '@okampus/shared/utils';

import type { UserOptions } from './user.options';
import type { TeamJoin } from '../team/team-join/team-join.entity';
import type { TeamMember } from '../team/team-member/team-member.entity';
import type { AdminRole } from '../tenant/admin-role/admin-role.entity';
import type { TenantMember } from '../tenant/tenant-member/tenant-member.entity';
import type { Session } from '@sentry/node';

@Entity({ customRepository: () => UserRepository })
export class User extends TenantScopedEntity {
  [EntityRepositoryType]!: UserRepository;

  @Unique()
  @Property({ type: 'text' }) // TODO: implement unique by tenant
  slug!: string;

  @Property({ type: 'text', nullable: true, default: null, hidden: true })
  passwordHash: string | null = null;

  @Property({ type: 'boolean', default: false })
  isBot = false;

  @OneToOne({ type: 'Actor', inversedBy: 'user' })
  actor: Actor;

  @OneToMany({ type: 'AdminRole', mappedBy: 'user' })
  @TransformCollection()
  adminRoles = new Collection<AdminRole>(this);

  @Property({ type: 'text' })
  firstName!: string;

  @Property({ type: 'text' })
  lastName!: string;

  @Property({ type: 'array', default: [] })
  middleNames: string[] = [];

  @Property({ type: 'float', default: 0 })
  points = 0;

  @Property({ type: 'boolean', default: false })
  isOnboardingFinished = false;

  @Property({ type: 'boolean', default: false })
  isIntroductionFinished = false;

  @Property({ type: 'boolean', default: false })
  isDarkModePreferred = false;

  /** Export my data via the main email when my bankAccount is deactivated */
  @Property({ type: 'boolean', default: true })
  isDataExportedOnDeactivation = true;

  /** Anonymize my data when my bankAccount is deactivated */
  @Property({ type: 'boolean', default: false })
  isDataAnonymizedOnDeactivation = false;

  @OneToMany({ type: 'TeamMember', mappedBy: 'user' })
  @TransformCollection()
  teamMemberships = new Collection<TeamMember>(this);

  @OneToMany({ type: 'TenantMember', mappedBy: 'user' })
  @TransformCollection()
  tenantMemberships = new Collection<TenantMember>(this);

  @OneToMany({ type: 'TeamJoin', mappedBy: 'joinedBy' })
  @TransformCollection()
  teamJoins = new Collection<TeamJoin>(this);

  @OneToMany({ type: 'Session', mappedBy: 'user' })
  @TransformCollection()
  sessions = new Collection<Session>(this);

  constructor(options: UserOptions) {
    super(options);
    this.assign(options);

    if (!options.slug) this.slug = toSlug(`${options.name}-${randomId()}`);

    this.actor = new Actor({
      name: options.name ?? `${options.firstName} ${options.lastName}`,
      bio: options.bio,
      email: options.email,
      createdBy: options.createdBy,
      user: this,
      tenantScope: options.tenantScope,
    });
  }
}

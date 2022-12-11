/* eslint-disable import/no-cycle */
import type { EntityManager } from '@mikro-orm/core';
import {
  Cascade,
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

import { TransformCollection } from '@common/lib/decorators/transform-collection.decorator';
import { BaseTenantEntity } from '@common/lib/entities/base-tenant.entity';
import type { BaseSearchableEntity } from '@common/lib/types/interfaces/base-searchable.interface';
import type { UserCreationOptions } from '@common/lib/types/interfaces/user-creation-options.interface';
import { _slugify } from '@common/lib/utils/slugify';
import { Role } from '@common/modules/authorization/types/role.enum';
import { ScopeRole } from '@common/modules/authorization/types/scope-role.enum';
import { Paginated } from '@common/modules/pagination';
import type { BaseIndex } from '@common/modules/search/indexed-entity.interface';
import type { Favorite } from '@modules/interact/favorites/favorite.entity';
import type { Reaction } from '@modules/interact/reactions/reaction.entity';
import type { Report } from '@modules/interact/reports/report.entity';
import type { Vote } from '@modules/interact/votes/vote.entity';
import { ClassMembership } from '@modules/org/classes/memberships/class-membership.entity';
import { Interest } from '@modules/org/teams/interests/interest.entity';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { TeamMembershipRequest } from '@modules/org/teams/requests/team-membership-request.entity';
import { Tenant } from '@modules/org/tenants/tenant.entity';

import type { RegisterDto } from '../auth/dto/register.dto';
import { BadgeUnlock } from '../badges/entities/badge-unlock.entity';
import { Settings } from '../settings/settings.entity';
import { Statistics } from '../statistics/statistics.entity';
import { UserImage } from '../user-images/user-image.entity';

@ObjectType()
@Entity()
export class User extends BaseTenantEntity implements BaseSearchableEntity {
  @Field()
  @PrimaryKey()
  id!: string;

  @Field(() => String, { nullable: true })
  @Unique()
  @Property({ type: 'text', nullable: true })
  email!: string;

  @Field(() => Boolean)
  @Index()
  @Property()
  bot = false;

  @Field()
  @Property({ type: 'text' })
  name: string;

  @Field(() => String, { nullable: true })
  @Index()
  @Property({ type: 'text', nullable: true })
  lastName: string | null = null;

  @Property({ type: 'text', hidden: true, nullable: true })
  password: string | null = null;

  @Field(() => String)
  @Property()
  @Unique()
  eventIcal = nanoid(64);

  // Roles
  @Field(() => [Role])
  @Enum({ default: [Role.User], array: true })
  roles = [Role.User];

  @Field(() => ScopeRole)
  @Enum(() => ScopeRole)
  scopeRole!: ScopeRole;

  // Stats & point system
  @Field(() => Settings)
  @OneToOne('Settings', 'user', { cascade: [Cascade.ALL] })
  settings!: Settings;

  // TODO: add full reputation system
  @OneToOne('Statistics', 'user', { cascade: [Cascade.ALL] })
  statistics!: Statistics;

  @Field(() => Int)
  @Property()
  points = 0;

  @Field(() => [BadgeUnlock], { nullable: true })
  @OneToMany('BadgeUnlock', 'user')
  badges = new Collection<BadgeUnlock>(this);

  // Profile customization
  @Field(() => UserImage, { nullable: true })
  @ManyToOne({ type: UserImage, cascade: [Cascade.ALL], nullable: true })
  avatar: UserImage | null = null;

  @Field(() => UserImage, { nullable: true })
  @ManyToOne({ type: UserImage, cascade: [Cascade.ALL], nullable: true })
  banner: UserImage | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  status: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  color: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  signature: string | null = null;

  @Field(() => Boolean)
  @Property({ default: false })
  finishedIntroduction = false;

  @Field(() => Boolean)
  @Property({ default: false })
  finishedOnboarding = false;

  @Field(() => [ClassMembership])
  @OneToMany('ClassMembership', 'user')
  classMemberships = new Collection<ClassMembership>(this);

  @Field(() => [TeamMembershipRequest])
  @OneToMany('TeamMembershipRequest', 'user')
  teamMembershipRequests = new Collection<TeamMembershipRequest>(this);

  @Field(() => [TeamMember])
  @OneToMany('TeamMember', 'user')
  teamMemberships = new Collection<TeamMember>(this);

  @Field(() => [Interest])
  @OneToMany('Interest', 'user')
  interests = new Collection<Interest>(this);

  @OneToMany('Reaction', 'user', { cascade: [Cascade.ALL] })
  @TransformCollection()
  reactions = new Collection<Reaction>(this);

  @OneToMany('Report', 'user', { cascade: [Cascade.ALL] })
  @TransformCollection()
  reports = new Collection<Report>(this);

  @OneToMany('Vote', 'user', { cascade: [Cascade.ALL] })
  @TransformCollection()
  votes = new Collection<Vote>(this);

  @OneToMany('Favorite', 'user', { cascade: [Cascade.ALL] })
  @TransformCollection()
  favorites = new Collection<Favorite>(this);

  isPublic = false;

  constructor(
    options: Omit<RegisterDto, 'avatar' | 'banner' | 'password'>,
    tenant: Tenant,
  ) {
    super();
    this.assign({ ...options, tenant });
  }

  public toIndexed(): BaseIndex {
    return {
      title: `${this.name.split(' ')[0]} ${this.lastName}`,
      picture: this.avatar?.file.url ?? null,
      description: this.status ?? this.scopeRole,
      category: this.scopeRole,
      createdDate: this.createdAt.getTime(),
      updatedDate: this.updatedAt.getTime(),
      score: this.points,
      users: [`${this.name.split(' ')[0]} ${this.lastName}`],
      tags: this.roles,
    };
  }

  public async setPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password!);
  }

  public hasChanged(dto: UserCreationOptions): boolean {
    return this.name !== dto.name
      || this.lastName !== dto.lastName
      || this.email !== dto.email
      || this.scopeRole !== dto.scopeRole;
  }

  public getFullName(): string {
    return `${this.name.split(' ')[0]} ${this.lastName}`;
  }
}

@ObjectType()
export class PaginatedUser extends Paginated(User) {}

export class UserFactory extends Factory<User> {
  tenant: Tenant;
  scopeRole: ScopeRole;
  model = User;

  constructor(em: EntityManager, tenant: Tenant, scopeRole: ScopeRole) {
    super(em);
    this.tenant = tenant;
    this.scopeRole = scopeRole;
  }

  public definition(faker: Faker): Partial<User> {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      id: nanoid(16),
      tenant: this.tenant,
      name: firstName,
      lastName,
      email: _slugify(`${firstName}.${lastName}@${this.tenant.slug}.fr`),
      // eslint-disable-next-line node/no-sync
      password: bcrypt.hashSync('root', 10),
      scopeRole: this.scopeRole,
      bot: this.scopeRole === ScopeRole.AdminBot || this.scopeRole === ScopeRole.UserBot,
    };
  }
}

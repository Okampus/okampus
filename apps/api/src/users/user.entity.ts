import {
  Cascade,
  Collection,
  Entity,
  Enum,
  Index,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
// eslint-disable-next-line import/no-cycle
import { BadgeUnlock } from '../badges/entities/badge-unlock.entity';
import type { Favorite } from '../favorites/favorite.entity';
import type { Reaction } from '../reactions/reaction.entity';
import type { Report } from '../reports/report.entity';
// eslint-disable-next-line import/no-cycle
import { SchoolGroupMembership } from '../school-group/memberships/school-group-membership.entity';
// eslint-disable-next-line import/no-cycle
import { Settings } from '../settings/settings.entity';
import { TransformCollection } from '../shared/lib/decorators/transform-collection.decorator';
// eslint-disable-next-line import/no-cycle
import { BaseTenantEntity } from '../shared/lib/entities/base-tenant-entity';
import type { BaseSearchableEntity } from '../shared/lib/types/interfaces/base-searchable.interface';
import type { UserCreationOptions } from '../shared/lib/types/interfaces/user-creation-options.interface';
import { Role } from '../shared/modules/authorization/types/role.enum';
import { SchoolRole } from '../shared/modules/authorization/types/school-role.enum';
import type { BaseIndex } from '../shared/modules/search/indexed-entity.interface';
// eslint-disable-next-line import/no-cycle
import { Statistics } from '../statistics/statistics.entity';
// eslint-disable-next-line import/no-cycle
import { TeamMember } from '../teams/members/team-member.entity';
// eslint-disable-next-line import/no-cycle
import { TeamMembershipRequest } from '../teams/requests/team-membership-request.entity';
import type { Tenant } from '../tenants/tenants/tenant.entity';
import type { Vote } from '../votes/vote.entity';

@ObjectType()
@Entity()
export class User extends BaseTenantEntity implements BaseSearchableEntity {
  @Field()
  @PrimaryKey()
  id!: string;

  @Field()
  @Property({ type: 'text' })
  firstname!: string;

  @Field()
  @Property({ type: 'text' })
  lastname!: string;

  @Property({ type: 'text', hidden: true })
  password: string | null = null;

  @Field()
  @Property({ type: 'text' })
  @Index()
  email!: string;

  @Field(() => [BadgeUnlock], { nullable: true })
  @OneToMany('BadgeUnlock', 'user')
  badges = new Collection<BadgeUnlock>(this);

  @Field(() => Boolean)
  @Property()
  bot = false;

  // TODO: Add full 'reputation' support
  @Field(() => Int)
  @Property()
  reputation = 0;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  avatar: string | null = null;

  @Field(() => [Role])
  @Enum({ default: [Role.User] })
  roles = [Role.User];

  @Field(() => SchoolRole)
  @Enum(() => SchoolRole)
  schoolRole!: SchoolRole;

  @Field(() => [SchoolGroupMembership])
  @OneToMany('SchoolGroupMembership', 'user')
  schoolGroupMemberships = new Collection<SchoolGroupMembership>(this);

  @Field(() => [TeamMembershipRequest])
  @OneToMany('TeamMembershipRequest', 'user')
  teamMembershipRequests = new Collection<TeamMembershipRequest>(this);

  @Field(() => [TeamMember])
  @OneToMany('TeamMember', 'user')
  teamMemberships = new Collection<TeamMember>(this);

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  color: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  signature: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  banner: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  shortDescription: string | null = null;

  @OneToOne('Statistics', 'user', { cascade: [Cascade.ALL] })
  statistics!: Statistics;

  @Field(() => Settings)
  @OneToOne('Settings', 'user', { cascade: [Cascade.ALL] })
  settings!: Settings;

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

  @Field(() => Int)
  @Property()
  points = 0;

  @Field(() => String)
  @Property()
  @Index()
  @Unique()
  teamEventIcal = nanoid(64);

  @Field(() => Boolean)
  @Property()
  finishedOnboarding = false;

  isPublic = false;

  constructor(options: Omit<UserCreationOptions, 'avatar' | 'banner' | 'password' | 'tenantId'> & { tenant: Tenant }) {
    super();
    this.assign(options);
  }

  public toIndexed(): BaseIndex {
    return {
      title: `${this.firstname.split(' ')[0]} ${this.lastname}`,
      picture: this.avatar,
      description: this.shortDescription ?? this.schoolRole,
      category: this.schoolRole,
      createdDate: this.createdAt.getTime(),
      updatedDate: this.updatedAt.getTime(),
      score: this.points,
      users: [`${this.firstname.split(' ')[0]} ${this.lastname}`],
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
    return this.firstname !== dto.firstname
      || this.lastname !== dto.lastname
      || this.email !== dto.email
      || this.schoolRole !== dto.schoolRole;
  }

  public getFullName(): string {
    return `${this.firstname.split(' ')[0]} ${this.lastname}`;
  }
}

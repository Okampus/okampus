import {
  Collection,
  Entity,
  Enum,
  Index,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
// eslint-disable-next-line import/no-cycle
import { BaseTenantEntity } from '../../shared/lib/entities/base-tenant-entity';
import { TeamKind } from '../../shared/lib/types/enums/team-kind.enum';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';
import type { BaseSearchableEntity } from '../../shared/lib/types/interfaces/base-searchable.interface';
import { Role } from '../../shared/modules/authorization/types/role.enum';
import type { BaseIndex } from '../../shared/modules/search/indexed-entity.interface';
import type { Tenant } from '../../tenants/tenants/tenant.entity';
import type { User } from '../../users/user.entity';

// eslint-disable-next-line import/no-cycle
import { TeamForm } from '../forms/team-form.entity';
// eslint-disable-next-line import/no-cycle
import { TeamHistory } from '../histories/history.entity';
// eslint-disable-next-line import/no-cycle
import { TeamMember } from '../members/team-member.entity';

const ADMIN_ROLES = new Set([TeamRole.Owner, TeamRole.Coowner, TeamRole.Treasurer, TeamRole.Secretary]);
const MANAGER_ROLES = new Set([
  TeamRole.Owner,
  TeamRole.Coowner,
  TeamRole.Treasurer,
  TeamRole.Secretary,
  TeamRole.Manager,
]);

@ObjectType()
@Entity()
export class Team extends BaseTenantEntity implements BaseSearchableEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => TeamKind)
  @Enum(() => TeamKind)
  @Index()
  kind!: TeamKind;

  @Field()
  @Index()
  @Property({ type: 'text' })
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  shortDescription: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  longDescription: string | null = null;

  @Field()
  @Property({ type: 'text' })
  category!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  email: string | null = null;

  @Field(() => [String])
  @Property()
  tags: string[] = [];

  @Field(() => [TeamHistory])
  @OneToMany('TeamHistory', 'team')
  histories = new Collection<TeamHistory>(this);

  @Field(() => String, { nullable: true })
  @Property()
  status: string | null = null;

  @Field(() => String, { nullable: true })
  @Property()
  presentationVideo: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  avatar: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  banner: string | null = null;

  @Field(() => [TeamMember])
  @OneToMany('TeamMember', 'team')
  @TransformCollection()
  members = new Collection<TeamMember>(this);

  @Field(() => Int)
  @Property()
  activeMemberCount = 1; // The member count is always at least one (when created - the first user is the owner)

  @Field(() => TeamForm, { nullable: true })
  @OneToOne('TeamForm')
  membershipRequestForm: TeamForm | null = null;

  isPublic = false;

  constructor(options: {
    name: string;
    kind: TeamKind;
    tenant: Tenant;
    category: string;
    email?: string | null;
    status?: string | null;
    presentationVideo?: string | null;
    avatar?: string | null;
    banner?: string | null;
    tags?: string[] | null;
    membershipRequestForm?: TeamForm | null;
  }) {
    super();
    this.assign(options);
  }

  public toIndexed(): BaseIndex {
    return {
      title: this.name,
      picture: this.avatar,
      description: this.shortDescription,
      category: this.kind,
      createdDate: this.createdAt.getTime(),
      updatedDate: this.updatedAt.getTime(),
      score: null,
      users: null,
      tags: [this.category],
    };
  }

  public canAdminister(user: User): boolean {
    return this.isGlobalAdmin(user) || this.isTeamAdmin(user);
  }

  public canManage(user: User): boolean {
    return this.isGlobalAdmin(user) || this.isTeamManager(user);
  }

  public canActOnRole(user: User, role: TeamRole): boolean {
    if (this.isGlobalAdmin(user))
      return true;

    if (!ADMIN_ROLES.has(role))
      return this.isTeamAdmin(user);

    return this.getMemberRoles(user).includes(TeamRole.Owner);
  }

  public isGlobalAdmin(user: User): boolean {
    return user.roles.includes(Role.Admin) || (this.kind === TeamKind.Club && user.roles.includes(Role.ClubManager));
  }

  private getMemberRoles(user: User): TeamRole[] {
    return this.members
      .getItems()
      .filter(member => member.user.id === user.id)
      .map(member => member.role);
  }

  private isTeamAdmin(user: User): boolean {
    return this.getMemberRoles(user).some(role => ADMIN_ROLES.has(role));
  }

  private isTeamManager(user: User): boolean {
    return this.getMemberRoles(user).some(role => MANAGER_ROLES.has(role));
  }
}

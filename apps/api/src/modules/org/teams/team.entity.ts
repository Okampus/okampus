/* eslint-disable import/no-cycle */
import {
  Collection,
  Entity,
  Enum,
  Index,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransformCollection } from '@common/lib/decorators/transform-collection.decorator';
import { BaseTenantEntity } from '@common/lib/entities/base-tenant-entity';
import { TeamKind } from '@common/lib/types/enums/team-kind.enum';
import { TeamRole } from '@common/lib/types/enums/team-role.enum';
import type { BaseSearchableEntity } from '@common/lib/types/interfaces/base-searchable.interface';
import { Role } from '@common/modules/authorization/types/role.enum';
import type { BaseIndex } from '@common/modules/search/indexed-entity.interface';
import { Label } from '@modules/catalog/labels/label.entity';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import type { User } from '@modules/uua/users/user.entity';
import type { Tenant } from '../tenants/tenant.entity';
import { TeamHistory } from './histories/team-history.entity';
import { TeamMember } from './members/team-member.entity';
import { Social } from './socials/social.entity';

const ADMIN_ROLES = new Set([
  TeamRole.Owner,
  TeamRole.Coowner,
  TeamRole.Treasurer,
  TeamRole.Secretary,
]);
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

  @Field(() => [Label])
  @ManyToMany()
  @TransformCollection()
  labels = new Collection<Label>(this);

  @Field(() => [TeamHistory])
  @OneToMany('TeamHistory', 'team')
  histories = new Collection<TeamHistory>(this);

  @Field(() => [Social])
  @OneToMany('Social', 'team')
  socials = new Collection<Social>(this);

  @Field(() => String, { nullable: true })
  @Property()
  status: string | null = null;

  @Field(() => String, { nullable: true })
  @Property()
  location: string | null = null;

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
    location?: string | null;
    presentationVideo?: string | null;
    avatar?: string | null;
    banner?: string | null;
    membershipRequestForm?: TeamForm | null;
  }) {
    super();
    this.assign(options);
  }

  public async toIndexed(): Promise<BaseIndex> {
    const labels = await this.labels.loadItems();
    return {
      title: this.name,
      picture: this.avatar,
      description: this.shortDescription,
      category: this.kind,
      createdDate: this.createdAt.getTime(),
      updatedDate: this.updatedAt.getTime(),
      score: null,
      users: null,
      tags: labels.map(label => label.name),
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
    return (
      user.roles.includes(Role.Admin)
      || (this.kind === TeamKind.Club && user.roles.includes(Role.ClubManager))
    );
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

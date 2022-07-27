import {
  Collection,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransformCollection } from '../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { SchoolGroupRole } from '../shared/lib/types/enums/school-group-role.enum';
import { Role } from '../shared/modules/authorization/types/role.enum';
import type { User } from '../users/user.entity';
// eslint-disable-next-line import/no-cycle
import { SchoolGroupMembership } from './memberships/school-group-membership.entity';

const ADMIN_ROLES = new Set([SchoolGroupRole.Representative, SchoolGroupRole.Substitute]);

@ObjectType()
@Entity()
export class SchoolGroup extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Property()
  @Index()
  @Unique()
  code!: string;

  @Field()
  @Property()
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  englishName: string | null = null;

  @Field(() => SchoolGroup, { nullable: true })
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  parent: SchoolGroup | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  description: string | null = null;

  @Field(() => [SchoolGroupMembership])
  @OneToMany('SchoolGroupMembership', 'schoolGroup')
  @TransformCollection()
  memberships = new Collection<SchoolGroupMembership>(this);

  @Field(() => Boolean)
  @Property()
  active = true;

  constructor(options: {
    name: string;
    code: string;
    englishName?: string | null;
    parent?: SchoolGroup | null;
    description?: string | null;
  }) {
    super();
    this.assign(options);
  }

  public canAdminister(user: User): boolean {
    return this.isGlobalAdmin(user) || this.isSchoolGroupAdmin(user);
  }

  public isGlobalAdmin(user: User): boolean {
    return user.roles.includes(Role.Admin);
  }

  private getMemberRoles(user: User): SchoolGroupRole[] {
    return this.memberships
      .getItems()
      .filter(membership => membership.active && membership.user.id === user.id)
      .map(member => member.role);
  }

  private isSchoolGroupAdmin(user: User): boolean {
    return this.getMemberRoles(user).some(role => ADMIN_ROLES.has(role));
  }
}

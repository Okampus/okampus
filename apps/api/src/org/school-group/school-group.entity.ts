/* eslint-disable import/no-cycle */
import {
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { SchoolGroupRole } from '../../shared/lib/types/enums/school-group-role.enum';
import { SchoolGroupType } from '../../shared/lib/types/enums/school-group-type.enum';
import { Role } from '../../shared/modules/authorization/types/role.enum';
import type { User } from '../../uua/users/user.entity';
import { SchoolGroupMembership } from './memberships/school-group-membership.entity';

const ADMIN_ROLES = new Set([SchoolGroupRole.Representative, SchoolGroupRole.Substitute]);

@ObjectType()
@Entity()
export class SchoolGroup extends BaseEntity {
  @Field()
  @PrimaryKey()
  id!: string;

  @Field()
  @Property()
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  englishName: string | null = null;

  @Field(() => SchoolGroupType)
  @Enum(() => SchoolGroupType)
  type = SchoolGroupType.Everyone;

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
    id: string;
    name: string;
    type?: SchoolGroupType | null;
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

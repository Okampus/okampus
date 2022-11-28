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
import { TransformCollection } from '@common/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { ClassRole } from '@common/lib/types/enums/class-role.enum';
import { ClassType } from '@common/lib/types/enums/class-type.enum';
import { Role } from '@common/modules/authorization/types/role.enum';
import type { User } from '@modules/uua/users/user.entity';
import { ClassMembership } from './memberships/class-membership.entity';

const ADMIN_ROLES = new Set([ClassRole.Representative, ClassRole.Substitute]);

@ObjectType()
@Entity()
export class Class extends BaseEntity {
  @Field()
  @PrimaryKey()
  id!: string;

  @Field()
  @Property()
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  englishName: string | null = null;

  @Field(() => ClassType)
  @Enum(() => ClassType)
  type = ClassType.Everyone;

  @Field(() => Class, { nullable: true })
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  parent: Class | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  description: string | null = null;

  @Field(() => [ClassMembership])
  @OneToMany('ClassMembership', 'schoolClass')
  @TransformCollection()
  memberships = new Collection<ClassMembership>(this);

  @Field(() => Boolean)
  @Property()
  active = true;

  constructor(options: {
    id: string;
    name: string;
    type?: ClassType | null;
    englishName?: string | null;
    parent?: Class | null;
    description?: string | null;
  }) {
    super();
    this.assign(options);
  }

  public canAdminister(user: User): boolean {
    return this.isGlobalAdmin(user) || this.isClassAdmin(user);
  }

  public isGlobalAdmin(user: User): boolean {
    return user.roles.includes(Role.TenantAdmin);
  }

  private getMemberRoles(user: User): ClassRole[] {
    return this.memberships
      .getItems()
      .filter(membership => membership.active && membership.user.id === user.id)
      .map(member => member.role);
  }

  private isClassAdmin(user: User): boolean {
    return this.getMemberRoles(user).some(role => ADMIN_ROLES.has(role));
  }
}

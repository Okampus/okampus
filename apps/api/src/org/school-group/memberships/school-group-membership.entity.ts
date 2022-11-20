/* eslint-disable import/no-cycle */
import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../../shared/lib/entities/base.entity';
import { SchoolGroupRole } from '../../../shared/lib/types/enums/school-group-role.enum';
import { User } from '../../../uua/users/user.entity';
import { SchoolGroup } from '../school-group.entity';
import { SchoolYear } from '../school-year/school-year.entity';

@ObjectType()
@Entity()
export class SchoolGroupMembership extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  user!: User;

  @Field(() => SchoolYear)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  schoolYear!: SchoolYear;

  @Field(() => SchoolGroup)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  schoolGroup!: SchoolGroup;

  @Field(() => SchoolGroupRole)
  @Enum(() => SchoolGroupRole)
  role = SchoolGroupRole.Student;

  @Property()
  @Index()
  active = true;

  constructor(options: {
    user: User;
    schoolYear: SchoolYear;
    schoolGroup: SchoolGroup;
    role?: SchoolGroupRole | null;
  }) {
    super();
    this.assign(options);
  }
}

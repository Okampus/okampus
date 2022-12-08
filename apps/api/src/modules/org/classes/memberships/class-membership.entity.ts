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
import { BaseEntity } from '@common/lib/entities/base.entity';
import { ClassRole } from '@common/lib/types/enums/class-role.enum';
import { Paginated } from '@common/modules/pagination';
import { User } from '@modules/uaa/users/user.entity';
import { Class } from '../class.entity';
import { SchoolYear } from '../school-year/school-year.entity';

@ObjectType()
@Entity()
export class ClassMembership extends BaseEntity {
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

  @Field(() => Class)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  schoolClass!: Class;

  @Field(() => ClassRole)
  @Enum(() => ClassRole)
  role = ClassRole.Student;

  @Property()
  @Index()
  active = true;

  constructor(options: {
    user: User;
    schoolYear: SchoolYear;
    schoolClass: Class;
    role?: ClassRole | null;
  }) {
    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedClassMembership extends Paginated(ClassMembership) {}

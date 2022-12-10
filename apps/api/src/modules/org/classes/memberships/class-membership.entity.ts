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
import { Class } from '@classes/class.entity';
import { SchoolYear } from '@classes/school-year/school-year.entity';
import { Paginated } from '@common/modules/pagination';
import { BaseEntity } from '@lib/entities/base.entity';
import { ClassRole } from '@lib/types/enums/class-role.enum';
import { User } from '@uaa/users/user.entity';

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

import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import {
  Field,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { SchoolGroupRole } from '../../shared/lib/types/enums/school-group-role.enum';
// eslint-disable-next-line import/no-cycle
import { User } from '../../users/user.entity';

// eslint-disable-next-line import/no-cycle
import { SchoolGroup } from '../school-group.entity';
import { SchoolYear } from '../school-year/school-year.entity';

@ObjectType()
@Entity()
export class SchoolGroupMembership extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Property()
  @Index()
  active = true;

  @Field(() => SchoolYear)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  schoolYear!: SchoolYear;

  @Field(() => SchoolGroup)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  schoolGroup!: SchoolGroup;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  user!: User;

  @Field(() => SchoolGroupRole)
  @Enum(() => SchoolGroupRole)
  role = SchoolGroupRole.Student;

  constructor(options: {
    user: User;
    schoolYear: SchoolYear;
    schoolGroup: SchoolGroup;
    role: SchoolGroupRole;
  }) {
    super();
    this.assign(options);
  }
}

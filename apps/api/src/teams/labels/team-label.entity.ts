import {
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamLabelType } from '../../shared/lib/types/enums/team-label-type.enum';

@ObjectType()
@Entity()
export class TeamLabel extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  slug!: string;

  @Field(() => String)
  @Property()
  name!: string;

  @Field(() => String)
  @Property()
  tooltip!: string;

  @Field(() => TeamLabelType)
  @Property()
  type!: TeamLabelType;

  constructor(options: {
    slug: string;
    name: string;
    tooltip: string;
    type: TeamLabelType;
  }) {
    super();
    this.assign(options);
  }
}

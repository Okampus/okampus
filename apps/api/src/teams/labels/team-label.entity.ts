import {
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import slugify from 'slugify';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamLabelType } from '../../shared/lib/types/enums/team-label-type.enum';

@ObjectType()
@Entity()
export class TeamLabel extends BaseEntity {
  @Field(() => String)
  @PrimaryKey()
  id!: string;

  @Field(() => String)
  @Property()
  name!: string;

  @Field(() => String, { nullable: true })
  @Property()
  tooltip: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  image: string | null = null;

  @Field(() => TeamLabelType)
  @Property()
  type!: TeamLabelType;

  constructor(options: {
    id?: string;
    name: string;
    tooltip?: string;
    image?: string;
    type: TeamLabelType;
  }) {
    if (typeof options.id === 'undefined')
      options.id = slugify(options.name, { lower: true });

    super();
    this.assign(options);
  }
}

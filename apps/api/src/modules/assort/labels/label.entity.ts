import {
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import slugify from 'slugify';
import { BaseEntity } from '@meta/shared/lib/entities/base.entity';
import { LabelType } from '@meta/shared/lib/types/enums/label-type.enum';

@ObjectType()
@Entity()
export class Label extends BaseEntity {
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

  @Field(() => LabelType)
  @Property()
  type!: LabelType;

  constructor(options: {
    id?: string;
    name: string;
    tooltip?: string;
    image?: string;
    type: LabelType;
  }) {
    if (typeof options.id === 'undefined')
      options.id = slugify(options.name, { lower: true });

    super();
    this.assign(options);
  }
}

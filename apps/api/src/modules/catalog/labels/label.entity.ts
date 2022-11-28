import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import slugify from 'slugify';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { LabelType } from '@common/lib/types/enums/label-type.enum';

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
  @Enum(() => LabelType)
  type: LabelType = LabelType.Meta;

  constructor(options: {
    id?: string;
    name: string;
    tooltip?: string;
    image?: string;
    type?: LabelType;
  }) {
    if (typeof options.id === 'undefined')
      options.id = slugify(options.name, { lower: true });

    super();
    this.assign(options);
  }
}

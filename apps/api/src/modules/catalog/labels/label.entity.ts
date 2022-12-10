import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@lib/entities/base.entity';
import { LabelType } from '@lib/types/enums/label-type.enum';
import { _slugify } from '@lib/utils/slugify';

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
      options.id = _slugify(options.name);

    super();
    this.assign(options);
  }
}

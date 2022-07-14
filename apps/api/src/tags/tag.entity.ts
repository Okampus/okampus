import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { Colors } from '../shared/lib/types/enums/colors.enum';

@ObjectType()
@Entity()
export class Tag extends BaseEntity {
  @Field()
  @PrimaryKey({ type: 'text' })
  name!: string;

  @Field(() => Colors)
  @Enum(() => Colors)
  color!: Colors;

  @Field()
  @Property({ type: 'text' })
  description?: string;

  constructor(options: { name: string; color: Colors; description?: string }) {
    super();
    this.name = options.name;
    this.color = options.color;
    this.description = options.description;
  }
}

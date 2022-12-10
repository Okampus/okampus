import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/modules/pagination';
import { BaseEntity } from '@lib/entities/base.entity';
import { Colors } from '@lib/types/enums/colors.enum';

@ObjectType()
@Entity()
export class Tag extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  name!: string;

  @Field(() => Colors)
  @Enum(() => Colors)
  color!: Colors;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  description: string | null = null;

  constructor(options: {
    name: string;
    color: Colors;
    description?: string | null;
  }) {
    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedTags extends Paginated(Tag) {}

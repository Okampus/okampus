import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../shared/lib/entities/base.entity';

@ObjectType()
@Entity()
export class SchoolYear extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  name!: string;

  @Field(() => Boolean)
  @Property()
  active = true;

  constructor(options: {
    name: string;
  }) {
    super();
    this.assign(options);
  }
}

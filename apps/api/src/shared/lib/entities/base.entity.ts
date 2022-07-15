import { Property } from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
// Import { Exclude } from 'class-transformer';

@ObjectType()
export abstract class BaseEntity {
  @Field(() => GraphQLISODateTime)
  @Property()
  createdAt = new Date();

  @Field(() => GraphQLISODateTime)
  @Property({ onUpdate: () => new Date() })
  // @Exclude()
  updatedAt = new Date();
}

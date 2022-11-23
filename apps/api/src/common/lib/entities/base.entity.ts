import { Property } from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseEntity {
  @Field(() => GraphQLISODateTime)
  @Property()
  createdAt = new Date();

  @Field(() => GraphQLISODateTime)
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  protected assign(options: object): void {
    for (const [key, value] of Object.entries(options)) {
      if (typeof value !== 'undefined' && value !== null)
        this[key as keyof typeof this] = value;
    }
  }
}

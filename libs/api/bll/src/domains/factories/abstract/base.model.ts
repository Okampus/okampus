import { AggregateRoot } from '@nestjs/cqrs';
import { Field, GraphQLISODateTime, InterfaceType, ObjectType } from '@nestjs/graphql';
import { isIn } from '@okampus/shared/utils';

import type { IBase } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';

@InterfaceType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export abstract class BaseModel extends AggregateRoot implements IBase {
  @Field(() => String)
  id!: Snowflake;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  deletedAt!: Date | null;

  protected assign<T extends object>(options: T): void {
    for (const [key, value] of Object.entries(options)) {
      if (isIn(key, this)) this[key] = value;
    }
  }

  toJSON(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this)) {
      if (value !== undefined) data[key] = value;
    }
    return data;
  }
}

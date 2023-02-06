import { AggregateRoot } from '@nestjs/cqrs';
import { Field, GraphQLISODateTime, InterfaceType, ObjectType } from '@nestjs/graphql';
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
      if (value !== undefined) this[key as keyof typeof this] = value;
    }
  }

  toJSON(): Record<string, unknown> {
    // eslint-disable-next-line unicorn/no-array-reduce
    return Object.entries(this).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {} as Record<string, unknown>);
  }
}

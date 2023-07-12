import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IndexedUser {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  realId!: string;

  @Field(() => String)
  metaType!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  picture!: string;

  @Field(() => String)
  category!: string;

  @Field(() => Int)
  createdDate!: number;

  @Field(() => Int)
  updatedDate!: number;

  @Field(() => Int)
  score!: number;

  @Field(() => [String])
  tags!: string[];
}

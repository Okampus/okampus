import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class ParentDto {
  @Field(() => Int)
  @IsInt()
  parentId: number;
}

import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';

@InputType()
export class TeachClassProps {
  @Field(() => GraphQLISODateTime)
  @IsDate()
  startDate!: Date;
}

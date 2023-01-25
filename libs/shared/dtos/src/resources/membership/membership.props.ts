import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional } from 'class-validator';

@InputType()
export class MembershipProps {
  @Field(() => GraphQLISODateTime)
  @IsOptional()
  @IsDate()
  startDate?: Date;
}

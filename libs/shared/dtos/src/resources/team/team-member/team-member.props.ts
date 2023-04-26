import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class TeamMemberProps {
  @Field(() => Int)
  @IsInt()
  permissions!: number;
}

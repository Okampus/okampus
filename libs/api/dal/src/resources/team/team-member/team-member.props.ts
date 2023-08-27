import { Field, InputType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';

@InputType()
export class TeamMemberProps {
  @Field(() => Date)
  @IsDate()
  start?: Date;
}

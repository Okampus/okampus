import { Field, InputType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';

@InputType()
export class TenantMemberProps {
  @Field(() => Date)
  @IsDate()
  start?: Date;
}

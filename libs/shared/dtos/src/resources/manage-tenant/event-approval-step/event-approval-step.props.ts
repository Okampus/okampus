import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class EventApprovalStepProps {
  @Field(() => String, { nullable: true })
  @IsString()
  name!: string;
}

import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class EventApprovalStepProps {
  @Field(() => String, { nullable: true })
  @IsString()
  name!: string;

  @Field(() => Int)
  @IsInt()
  order!: number;
}

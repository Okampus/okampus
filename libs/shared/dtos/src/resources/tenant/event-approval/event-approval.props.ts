import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class EventApprovalProps {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  message?: string | null;

  @Field(() => Boolean)
  @IsBoolean()
  isApproved!: boolean;
}

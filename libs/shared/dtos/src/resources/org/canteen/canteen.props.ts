import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CanteenProps {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}

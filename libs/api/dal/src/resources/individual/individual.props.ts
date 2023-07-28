import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class IndividualProps {
  @Field(() => String)
  @IsOptional()
  @IsString()
  status?: string;
}

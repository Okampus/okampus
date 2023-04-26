import { Field, InputType } from '@nestjs/graphql';
import { Length, IsString, IsOptional } from 'class-validator';

@InputType()
export class ChangeRoleProps {
  @Field(() => String)
  @Length(1, 10_000)
  @IsString()
  @IsOptional()
  note?: string;
}

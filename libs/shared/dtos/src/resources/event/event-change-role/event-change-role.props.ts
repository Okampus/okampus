import { Field, InputType } from '@nestjs/graphql';
import { Length, IsString, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class EventChangeRoleProps {
  @Field(() => String)
  @Length(1, 10_000)
  @IsString()
  @IsOptional()
  note?: string;

  @Field(() => Boolean)
  @IsBoolean()
  accepted!: boolean;
}

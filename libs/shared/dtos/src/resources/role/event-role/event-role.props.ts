import { Field, InputType, Int } from '@nestjs/graphql';
import { Length, IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';

@InputType()
export class EventRoleProps {
  @Field(() => String, { nullable: true })
  @Length(1, 1000)
  @IsString()
  description: string | null = null;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  autoAccept?: boolean | null = null;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  rewardMinimum: number | null = null;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  rewardMaximum: number | null = null;
}

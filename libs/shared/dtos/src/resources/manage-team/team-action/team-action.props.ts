import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class TeamActionProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 20_000)
  @IsString()
  description: string | null = null;

  @Field(() => Int)
  @IsInt()
  score!: number;
}

import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class ProjectProps {
  @Field(() => String)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string | null = null;

  @Field(() => Int)
  @IsInt()
  expectedBudget!: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsInt()
  actualBudget: number | null = null;
}

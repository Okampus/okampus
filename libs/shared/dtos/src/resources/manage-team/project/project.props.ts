import { Field, Float, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class ProjectProps {
  @Field(() => String)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string | null = null;

  @Field(() => Float)
  @IsNumber()
  expectedBudget!: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  actualBudget?: number | null = null;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isPrivate = false;
}

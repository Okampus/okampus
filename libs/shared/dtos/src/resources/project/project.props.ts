import { Field, Float, InputType } from '@nestjs/graphql';
import { Colors } from '@okampus/shared/enums';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @Field(() => Colors, { nullable: true })
  @IsEnum(Colors)
  color!: Colors;

  @Field(() => String)
  @IsString()
  slug!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  regularEventInterval?: string | null = null;
}

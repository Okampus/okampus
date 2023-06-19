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

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  budget?: number | null = null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  regularEventInterval?: string = '';

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean = false;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean = false;

  @Field(() => Colors, { nullable: true })
  @IsEnum(Colors)
  color!: Colors;

  @Field(() => String)
  @IsString()
  slug!: string;
}

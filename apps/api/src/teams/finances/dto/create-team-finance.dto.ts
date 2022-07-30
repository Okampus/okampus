import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { TeamFinanceCategory } from '../../../shared/lib/types/enums/team-finance-category.enum';
import { TeamFinanceMeans } from '../../../shared/lib/types/enums/team-finance-means.enum';
import { TeamFinanceType } from '../../../shared/lib/types/enums/team-finance-type.enum';

@InputType()
export class CreateTeamFinanceDto {
  @Field()
  @IsString()
  @Length(1, 255)
  title: string;

  @Field()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @Field(() => TeamFinanceMeans)
  @IsEnum(TeamFinanceMeans)
  means: TeamFinanceMeans;

  @Field(() => TeamFinanceType)
  @IsEnum(TeamFinanceType)
  type: TeamFinanceType;

  @Field(() => TeamFinanceCategory)
  @IsEnum(TeamFinanceCategory)
  category: TeamFinanceCategory;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  dueTo?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  event?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  receipt?: string;
}

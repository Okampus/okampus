import { Field, InputType, Int } from '@nestjs/graphql';
import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ListOptionsDto } from '@lib/dto/list-options.dto';
import { TeamFinanceCategory } from '@lib/types/enums/team-finance-category.enum';
import { TeamFinanceState } from '@lib/types/enums/team-finance-type.enum';

@InputType()
export class TeamFinancesFilterDto {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  id: number;

  @Field(() => TeamFinanceState, { nullable: true })
  @IsOptional()
  @IsEnum(TeamFinanceState)
  type?: TeamFinanceState;

  @Field(() => TeamFinanceCategory, { nullable: true })
  @IsOptional()
  @IsEnum(TeamFinanceCategory)
  category?: TeamFinanceCategory;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  dueTo?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  event?: number;
}

export class ListTeamFinancesDto extends IntersectionType(
  TeamFinancesFilterDto,
  PartialType(ListOptionsDto),
) {}

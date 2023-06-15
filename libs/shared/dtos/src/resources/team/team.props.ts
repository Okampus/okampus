import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { TeamType } from '@okampus/shared/enums';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class TeamProps {
  @Field(() => TeamType, { nullable: true })
  @IsOptional()
  @IsEnum(TeamType)
  type: TeamType = TeamType.Club;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  currentFinance?: number = 0;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  @IsInt()
  membershipFees?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  directorsCategoryName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  managersCategoryName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  membersCategoryName?: string;
}

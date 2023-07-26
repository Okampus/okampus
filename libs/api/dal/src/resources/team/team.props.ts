import { Field, InputType, Int } from '@nestjs/graphql';
import { TeamType } from '@okampus/shared/enums';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class TeamProps {
  @Field(() => TeamType, { nullable: true })
  @IsOptional()
  @IsEnum(TeamType)
  type: TeamType = TeamType.Club;

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

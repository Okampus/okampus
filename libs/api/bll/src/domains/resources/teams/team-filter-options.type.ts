import { Field, InputType } from '@nestjs/graphql';
import { TeamType } from '@okampus/shared/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class TeamFilterOptions {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  categories?: string[];

  @Field(() => [TeamType], { nullable: true })
  @IsOptional()
  @IsEnum(TeamType, { each: true })
  types?: TeamType[];
}

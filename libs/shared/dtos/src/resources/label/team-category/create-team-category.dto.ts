import { Field, InputType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';
import { IsString } from 'class-validator';
import { TeamCategoryProps } from './team-category.props';

@InputType()
export class CreateTeamCategoryDto extends TeamCategoryProps {
  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  teamsIds: Snowflake[] = [];
}

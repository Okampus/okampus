import { TeamCategoryProps } from './team-category.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class CreateTeamCategoryDto extends TeamCategoryProps {
  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  teamsIds: Snowflake[] = [];
}

import { TeamJoinProps } from './team-join.props';

import { CreateJoinDto } from '../create-join.dto';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class CreateTeamJoinDto extends IntersectionType(TeamJoinProps, CreateJoinDto) {
  @Field(() => String)
  @IsString() // TODO: create custom validator for UUID
  teamId!: Snowflake;

  @Field(() => String)
  @IsString() // TODO: create custom validator for UUID
  askedRoleId!: Snowflake;
}

import { CreateTeamJoinDto } from './create-team-join.dto';
import { UpdateJoinDto } from '../update-join.dto';

import { Field, InputType, IntersectionType, OmitType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateTeamJoinDto extends IntersectionType(
  PartialType(OmitType(CreateTeamJoinDto, ['joinerId', 'teamId'])),
  UpdateJoinDto
) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  receivedRoleId?: Snowflake;
}

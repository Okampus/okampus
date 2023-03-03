import { CreateTeamDto } from './create-team.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}

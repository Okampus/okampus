import { CreateTeamDto } from './create-team.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @Field(() => String)
  id!: Snowflake;
}

import { CreateTeamFinanceDto } from './team-finance-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateTeamFinanceDto extends PartialType(CreateTeamFinanceDto) {
  @Field(() => String)
  id!: Snowflake;

  // TODO: update relationships
}

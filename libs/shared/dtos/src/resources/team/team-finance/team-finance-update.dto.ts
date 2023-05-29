import { CreateTeamFinanceDto } from './team-finance-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTeamFinanceDto extends PartialType(CreateTeamFinanceDto) {
  @Field(() => String)
  id!: string;

  // TODO: update relationships
}

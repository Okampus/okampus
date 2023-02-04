import { Field, InputType, PartialType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';
import { CreateFinanceDto } from './create-finance.dto';

@InputType()
export class UpdateFinanceDto extends PartialType(CreateFinanceDto) {
  @Field(() => String)
  id!: Snowflake;

  // TODO: update relationships
}

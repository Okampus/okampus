import { CreateFinanceDto } from './create-finance.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateFinanceDto extends PartialType(CreateFinanceDto) {
  @Field(() => String)
  id!: Snowflake;

  // TODO: update relationships
}

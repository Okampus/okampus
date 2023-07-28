import { CreateFinanceDto } from './finance-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFinanceDto extends PartialType(CreateFinanceDto) {
  @Field(() => String)
  id!: string;

  // TODO: update relationships
}

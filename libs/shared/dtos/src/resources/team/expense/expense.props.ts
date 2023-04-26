import { Field, InputType } from '@nestjs/graphql';
import { ApprovalState } from '@okampus/shared/enums';
import { IsEnum } from 'class-validator';

@InputType()
export class ExpenseProps {
  @Field(() => ApprovalState)
  @IsEnum(ApprovalState)
  state!: ApprovalState;
}

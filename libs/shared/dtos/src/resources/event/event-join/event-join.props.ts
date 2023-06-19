import { Field, InputType } from '@nestjs/graphql';
import { ApprovalState } from '@okampus/shared/enums';
import { IsEnum } from 'class-validator';

@InputType()
export class EventJoinProps {
  @Field(() => ApprovalState, { nullable: true })
  @IsEnum(ApprovalState)
  state!: ApprovalState;
}

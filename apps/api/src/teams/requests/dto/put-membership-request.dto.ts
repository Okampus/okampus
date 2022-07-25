import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { MembershipRequestState } from '../../types/membership-request-state.enum';

@InputType()
export class PutTeamMembershipRequestDto {
  @Field(() => MembershipRequestState) // TODO
  @IsIn([MembershipRequestState.Approved, MembershipRequestState.Rejected])
  state: MembershipRequestState.Approved | MembershipRequestState.Rejected;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  handledMessage?: string;
}

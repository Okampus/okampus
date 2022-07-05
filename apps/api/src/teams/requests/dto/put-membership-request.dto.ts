import { IsIn, IsOptional, IsString } from 'class-validator';
import { MembershipRequestState } from '../../types/membership-request-state.enum';

export class PutTeamMembershipRequestDto {
  @IsIn([MembershipRequestState.Approved, MembershipRequestState.Rejected])
  state: MembershipRequestState.Approved | MembershipRequestState.Rejected;

  @IsOptional()
  @IsString()
  handledMessage?: string;
}

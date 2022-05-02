import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { PaginateDto } from '../../shared/modules/pagination';
import { MembershipRequestState } from '../types/membership-request-state.enum';

export class MembershipRequestsListOptions extends PaginateDto {
  @IsOptional()
  @IsEnum(MembershipRequestState)
  state?: MembershipRequestState;

  @IsOptional()
  @IsIn(['all', 'in', 'out'])
  type?: 'all' | 'in' | 'out';
}

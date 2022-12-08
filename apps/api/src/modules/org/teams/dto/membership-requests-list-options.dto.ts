import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { MembershipRequestDirection } from '@common/lib/types/enums/membership-request-direction.enum';
import { MembershipRequestState } from '@common/lib/types/enums/membership-request-state.enum';
import { PaginationArgs } from '@common/modules/pagination';

@InputType()
export class FilterMembershipRequestsDto {
  @Field(() => MembershipRequestState, { nullable: true })
  @IsOptional()
  @IsEnum(MembershipRequestState)
  state?: MembershipRequestState;

  @Field(() => MembershipRequestDirection, { nullable: true })
  @IsOptional()
  @IsEnum(MembershipRequestDirection)
  type?: MembershipRequestDirection;
}

@InputType()
export class ListMembershipRequestsDto extends IntersectionType(FilterMembershipRequestsDto, PaginationArgs) {}

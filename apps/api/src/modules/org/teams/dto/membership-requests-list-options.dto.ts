import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationOptions } from '@common/modules/pagination';
import { MembershipRequestDirection } from '@lib/types/enums/membership-request-direction.enum';
import { MembershipRequestState } from '@lib/types/enums/membership-request-state.enum';

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
export class ListMembershipRequestsDto extends IntersectionType(FilterMembershipRequestsDto, PaginationOptions) {}

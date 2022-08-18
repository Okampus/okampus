/* eslint-disable max-classes-per-file */
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { MembershipRequestDirection } from '../../shared/lib/types/enums/membership-request-direction.enum';
import { PaginateDto } from '../../shared/modules/pagination';
import { MembershipRequestState } from '../types/membership-request-state.enum';

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
export class ListMembershipRequestsDto extends IntersectionType(FilterMembershipRequestsDto, PaginateDto) {}

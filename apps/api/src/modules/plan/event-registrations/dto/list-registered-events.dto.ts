/* eslint-disable max-classes-per-file */
import { Field, InputType, Int } from '@nestjs/graphql';
import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { TeamEventRegisterStatus } from '@common/lib/types/enums/team-event-register-status.enum';
import { PaginateDto } from '@common/modules/pagination';

@InputType()
export class FilterRegisteredEventsDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  eventId?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  userId?: string;

  @Field(() => TeamEventRegisterStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TeamEventRegisterStatus)
  status?: TeamEventRegisterStatus;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  present?: boolean;
}

export class ListRegisteredEventsDto extends IntersectionType(
  FilterRegisteredEventsDto,
  PartialType(PaginateDto),
) {}

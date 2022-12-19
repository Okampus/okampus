import { Field, InputType, Int } from '@nestjs/graphql';
import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from '@common/modules/pagination';
import { EventRegistrationStatus } from '@lib/types/enums/event-register-status.enum';

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

  @Field(() => EventRegistrationStatus, { nullable: true })
  @IsOptional()
  @IsEnum(EventRegistrationStatus)
  status?: EventRegistrationStatus;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  present?: boolean;
}

export class ListRegisteredEventsDto extends IntersectionType(
  FilterRegisteredEventsDto,
  PartialType(PaginationOptions),
) {}

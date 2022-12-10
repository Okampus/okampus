import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { PaginationOptions } from '@common/modules/pagination';
import { EventState } from '@lib/types/enums/event-state.enum';

export class ListEventApprovalsDto extends PartialType(PaginationOptions) {
  @IsOptional()
  @IsInt()
  step?: number;

  @IsOptional()
  @IsEnum(EventState)
  state?: EventState;

  @IsOptional()
  @IsInt()
  @Min(1)
  teamId: number;
}

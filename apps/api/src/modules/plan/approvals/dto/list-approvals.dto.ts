import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { EventState } from '@common/lib/types/enums/event-state.enum';
import { PaginateDto } from '@common/modules/pagination';

export class ListEventApprovalsDto extends PartialType(PaginateDto) {
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

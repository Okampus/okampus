import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { TeamEventState } from '../../../../shared/lib/types/enums/team-event-state.enum';
import { PaginateDto } from '../../../../shared/modules/pagination';

export class ListTeamEventValidationsDto extends PartialType(PaginateDto) {
  @IsOptional()
  @IsInt()
  step?: number;

  @IsOptional()
  @IsEnum(TeamEventState)
  state?: TeamEventState;

  @IsOptional()
  @IsInt()
  @Min(1)
  teamId: number;
}

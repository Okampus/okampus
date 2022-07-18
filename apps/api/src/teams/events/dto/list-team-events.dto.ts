import { PartialType } from '@nestjs/mapped-types';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ListOptionsDto } from '../../../shared/lib/dto/list-options.dto';
import { TeamEventState } from '../../../shared/lib/types/enums/team-event-state.enum';

export class ListTeamEventsDto extends PartialType(ListOptionsDto) {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsDate()
  before?: Date;

  @IsOptional()
  @IsDate()
  after?: Date;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  priceBelow?: number;

  @IsOptional()
  @IsEnum(TeamEventState)
  state?: TeamEventState;
}

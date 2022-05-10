import { PartialType } from '@nestjs/mapped-types';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ListOptionsDto } from '../../../shared/lib/dto/list-options.dto';

export class ListTeamEventsDto extends PartialType(ListOptionsDto) {
  @IsOptional()
  @IsInt()
  teamId?: number;

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
}

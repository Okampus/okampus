import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { TeamEventState } from '../../../shared/lib/types/enums/team-event-state.enum';

export class CreateTeamEventDto {
  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsString()
  @Length(5, 150)
  name: string;

  @IsString()
  @Length(5, 3000)
  description: string;

  @IsString()
  @Length(5, 500)
  place: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @IsString()
  @IsOptional()
  supervisorId?: string;

  @IsOptional()
  @IsBoolean()
  private?: boolean;

  @IsOptional()
  @IsEnum(TeamEventState)
  state?: TeamEventState;

  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsInt()
  templateId?: number;

  @IsObject()
  meta?: object;
}

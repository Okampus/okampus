import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
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
  @IsString()
  @Length(5, 500)
  meetingPoint?: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @IsString()
  @IsOptional()
  supervisor?: string;

  @IsOptional()
  @IsBoolean()
  private?: boolean;

  @IsOptional()
  @IsString()
  @Length(5, 500)
  preconditions?: string;

  @IsOptional()
  @IsString()
  @Length(5, 500)
  questionFallback?: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsEnum(TeamEventState)
  state?: TeamEventState;

  @IsInt()
  formId: number;
}

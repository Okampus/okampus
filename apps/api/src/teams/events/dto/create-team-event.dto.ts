import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateTeamEventDto {
  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsString()
  @Length(5, 150)
  shortDescription: string;

  @IsString()
  @Length(5, 3000)
  longDescription: string;

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
}

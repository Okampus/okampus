import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { AnnouncementState } from '@lib/types/enums/announcement-state.enum';

export class CreateAnnouncementDto {
  @Length(1, 200)
  @IsString()
  title: string;

  @Length(1, 1000)
  @IsString()
  shortDescription: string;

  @MaxLength(10_000)
  @IsOptional()
  @IsString()
  longDescription?: string;

  @IsInt()
  @Min(0)
  @Max(10)
  priority: number;

  @IsEnum(AnnouncementState)
  state: AnnouncementState;

  @IsDate()
  displayFrom: Date;

  @IsDate()
  displayUntil: Date;
}

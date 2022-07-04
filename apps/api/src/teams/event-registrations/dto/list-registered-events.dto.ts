import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { RegisterStatus } from '../../../shared/lib/types/enums/register-status.enum';
import { PaginateDto } from '../../../shared/modules/pagination';

export class ListRegisteredEventsDto extends PartialType(PaginateDto) {
  @IsOptional()
  @IsInt()
  eventId?: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(RegisterStatus)
  status?: RegisterStatus;
}

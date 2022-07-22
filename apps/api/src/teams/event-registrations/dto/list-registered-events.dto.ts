import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { TeamEventRegisterStatus } from '../../../shared/lib/types/enums/team-event-register-status.enum';
import { PaginateDto } from '../../../shared/modules/pagination';

export class ListRegisteredEventsDto extends PartialType(PaginateDto) {
  @IsOptional()
  @IsInt()
  eventId?: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(TeamEventRegisterStatus)
  status?: TeamEventRegisterStatus;
}

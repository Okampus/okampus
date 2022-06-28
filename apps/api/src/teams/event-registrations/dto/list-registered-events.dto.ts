import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from '../../../shared/modules/pagination';

export class ListRegisteredEventsDto extends PartialType(PaginateDto) {
  @IsOptional()
  @IsInt()
  eventId?: number;

  @IsOptional()
  @IsString()
  userId?: string;
}

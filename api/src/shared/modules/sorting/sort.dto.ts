import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from './sort-order.enum';

export class SortDto {
  @IsOptional()
  @IsEnum(SortOrder)
  sortBy?: SortOrder;
}

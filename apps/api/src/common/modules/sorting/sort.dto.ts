/* eslint-disable max-classes-per-file */
import { IsEnum, IsOptional } from 'class-validator';
import { ContentSortOrder, SortOrder } from './sort-order.enum';

export class SortDto {
  @IsOptional()
  @IsEnum(SortOrder)
  sortBy?: SortOrder;
}

export class ContentSortDto {
  @IsOptional()
  @IsEnum(ContentSortOrder)
  sortBy?: ContentSortOrder;
}

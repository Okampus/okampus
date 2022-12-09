import { IsOptional, IsString } from 'class-validator';
import { PaginationOptions } from '@common/modules/pagination';

export class FilterAndPaginationArgs extends PaginationOptions {
  @IsOptional()
  @IsString()
  category?: string;
}

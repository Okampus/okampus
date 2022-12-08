import { IsOptional, IsString } from 'class-validator';
import { PaginationArgs } from '@common/modules/pagination';

export class FilterAndPaginationArgs extends PaginationArgs {
  @IsOptional()
  @IsString()
  category?: string;
}

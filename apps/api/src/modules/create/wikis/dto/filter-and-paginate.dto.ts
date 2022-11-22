import { IsOptional, IsString } from 'class-validator';
import { PaginateDto } from '@meta/shared/modules/pagination';

export class FilterAndPaginateDto extends PaginateDto {
  @IsOptional()
  @IsString()
  category?: string;
}

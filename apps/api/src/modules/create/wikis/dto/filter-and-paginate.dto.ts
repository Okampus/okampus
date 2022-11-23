import { IsOptional, IsString } from 'class-validator';
import { PaginateDto } from '@common/modules/pagination';

export class FilterAndPaginateDto extends PaginateDto {
  @IsOptional()
  @IsString()
  category?: string;
}

import { IsOptional, IsString } from 'class-validator';
import { PaginateDto } from '../../shared/modules/pagination';

export class FilterAndPaginateDto extends PaginateDto {
  @IsOptional()
  @IsString()
  category?: string;
}

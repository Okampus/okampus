import { IsOptional, IsString } from 'class-validator';
import { PaginateDto } from '../../shared/modules/pagination/paginate.dto';

export class FilterAndPaginateDto extends PaginateDto {
  @IsOptional()
  @IsString()
  category?: string;
}

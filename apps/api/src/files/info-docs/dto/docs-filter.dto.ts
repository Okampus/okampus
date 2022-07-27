import { IsInt, IsOptional } from 'class-validator';
import { PaginateDto } from '../../../shared/modules/pagination';

// TODO: add filter via schoolGroup
export class DocsFilterDto extends PaginateDto {
  @IsOptional()
  @IsInt()
  year?: number;
}

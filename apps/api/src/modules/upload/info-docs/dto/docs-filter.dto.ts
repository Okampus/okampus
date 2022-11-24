import { IsInt, IsOptional } from 'class-validator';
import { PaginateDto } from '@common/modules/pagination';

// TODO: add filter via schoolClass
export class DocsFilterDto extends PaginateDto {
  @IsOptional()
  @IsInt()
  year?: number;
}

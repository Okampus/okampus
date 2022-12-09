import { IsInt, IsOptional } from 'class-validator';
import { PaginationOptions } from '@common/modules/pagination';

// TODO: add filter via schoolClass
export class DocsFilterDto extends PaginationOptions {
  @IsOptional()
  @IsInt()
  year?: number;
}

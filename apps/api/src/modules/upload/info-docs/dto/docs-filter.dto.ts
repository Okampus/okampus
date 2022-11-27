import { IsInt, IsOptional } from 'class-validator';
import { PaginationArgs } from '@common/modules/pagination';

// TODO: add filter via schoolClass
export class DocsFilterDto extends PaginationArgs {
  @IsOptional()
  @IsInt()
  year?: number;
}

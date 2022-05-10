import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginateDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  itemsPerPage?: number;
}

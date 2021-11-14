import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginateDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  itemsPerPage?: number;
}

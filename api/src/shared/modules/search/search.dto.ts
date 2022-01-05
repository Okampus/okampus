/* eslint-disable @typescript-eslint/naming-convention */
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import type { SearchParams } from 'typesense/lib/Typesense/Documents';

type Arguments = Exclude<SearchParams<object>, 'group_by'> & { group_by?: string };

export class SearchDto implements Arguments {
  @IsString()
  @MinLength(1)
  q: string;

  @IsString()
  @MinLength(1)
  query_by: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  query_by_weights?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  filter_by?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  sort_by?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  per_page?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  highlight_fields?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  highlight_start_tag?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  highlight_end_tag?: string;

  @IsOptional()
  @IsBoolean()
  full: boolean;
}

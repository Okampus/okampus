/* eslint-disable @typescript-eslint/naming-convention */
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import type { SearchParams } from 'typesense/lib/Typesense/Documents';

export class SearchDto implements SearchParams {
  @IsString()
  q: string;

  @IsString()
  query_by: string;

  @IsOptional()
  @IsString()
  query_by_weights?: string;

  @IsOptional()
  @IsBoolean()
  prefix?: boolean;

  @IsOptional()
  @IsString()
  filter_by?: string;

  @IsOptional()
  @IsString()
  sort_by?: string;

  @IsOptional()
  @IsString()
  facet_by?: string;

  @IsOptional()
  @IsInt()
  max_facet_values?: number;

  @IsOptional()
  @IsString()
  facet_query?: string;

  @IsOptional()
  @IsBoolean()
  prioritize_exact_match?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  per_page?: number;

  @IsOptional()
  @IsInt()
  group_limit?: number;

  @IsOptional()
  @IsString()
  include_fields?: string;

  @IsOptional()
  @IsString()
  exclude_fields?: string;

  @IsOptional()
  @IsString()
  highlight_fields?: string;

  @IsOptional()
  @IsString()
  highlight_full_fields?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  highlight_affix_num_tokens?: number;

  @IsOptional()
  @IsString()
  highlight_start_tag?: string;

  @IsOptional()
  @IsString()
  highlight_end_tag?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  snippet_threshold?: number;

  @IsOptional()
  @IsString()
  num_typos?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  min_len_1typo?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  min_len_2typo?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  typo_tokens_threshold?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  drop_tokens_threshold?: number;

  @IsOptional()
  @IsBoolean()
  exhaustive_search?: boolean;

  @IsOptional()
  @IsString()
  pinned_hits?: string;

  @IsOptional()
  @IsString()
  hidden_hits?: string;

  @IsOptional()
  @IsBoolean()
  enable_overrides?: boolean;

  @IsOptional()
  @IsBoolean()
  pre_segmented_query?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit_hits?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  search_cutoff_ms?: number;

  @IsOptional()
  @IsBoolean()
  use_cache?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  cache_ttl?: number;
}

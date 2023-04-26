import type { MEILISEARCH_TYPE_FIELD } from '@okampus/shared/consts';
import type { Snowflake } from '@okampus/shared/types';

export interface BaseSearchable {
  name: string;
  slug: string;
  tags: string[];
  categories: string[];
  thumbnail: string | null;
  description: string | null;
  createdAt: number;
  events: string[];
  teams: string[];
  individuals: string[];
  [key: string]: unknown;
}

export interface SearchableIndexed extends BaseSearchable {
  id: Snowflake;
  entityId: Snowflake;
  [MEILISEARCH_TYPE_FIELD]: string;
}

export interface Searchable {
  id: Snowflake;
  tenant: { id: Snowflake };
}

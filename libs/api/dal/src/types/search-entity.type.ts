import type { MEILISEARCH_TYPE_FIELD } from '@okampus/shared/consts';
import type { Snowflake } from '@okampus/shared/types';

export interface BaseSearchable {
  slug: string;
  title: string;
  thumbnail: string | null;
  description: string | null;
  categories: string[];
  createdAt: number;
  updatedAt: number;
  linkedUsers: string[];
  linkedEvents: string[];
  linkedTeams: string[];
  tags: string[];
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

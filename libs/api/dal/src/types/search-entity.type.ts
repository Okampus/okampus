import type { MEILISEARCH_TYPE_FIELD } from '@okampus/shared/consts';

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
  id: string;
  entityId: string;
  [MEILISEARCH_TYPE_FIELD]: string;
}

export interface Searchable {
  id: string;
  tenant: { id: string };
}

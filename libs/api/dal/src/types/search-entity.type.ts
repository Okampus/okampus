import type { TenantScopedEntity } from '../shards/abstract/tenant-scoped/tenant-scoped.entity';
import type { MEILISEARCH_TYPE_FIELD } from '@okampus/shared/consts';
import type { Snowflake } from '@okampus/shared/types';

export interface BaseSearchEntity {
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

export interface SearchEntity extends BaseSearchEntity {
  id: Snowflake;
  entityId: Snowflake;
  [MEILISEARCH_TYPE_FIELD]: string;
}

export interface SearchableEntity extends TenantScopedEntity {
  id: Snowflake;
  toIndexed(): BaseSearchEntity | Promise<BaseSearchEntity>;
}

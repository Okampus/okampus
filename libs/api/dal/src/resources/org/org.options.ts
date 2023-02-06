import type { ActorProps, OrgProps } from '@okampus/shared/dtos';
import type { TaggableOptions } from '../../shards/abstract/taggable/taggable.options';
import type { Org } from './org.entity';

export type OrgOptions = OrgProps &
  ActorProps &
  TaggableOptions & {
    parent?: Org | null;
  };

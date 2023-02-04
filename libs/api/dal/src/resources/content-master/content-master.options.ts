import type { ContentMasterProps } from '@okampus/shared/dtos';
import type { TaggableOptions } from '../../shards/abstract/taggable/taggable.options';
import type { Individual } from '../actor/individual/individual.entity';
import type { Ugc } from '../ugc/ugc.entity';

export type ContentMasterOptions = ContentMasterProps &
  TaggableOptions & {
    rootContent?: Ugc;
    contributors?: Individual[];
  };

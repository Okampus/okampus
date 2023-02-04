import type { ActorProps, IndividualProps } from '@okampus/shared/dtos';
import type { TaggableOptions } from '../../../shards/abstract/taggable/taggable.options';

export type IndividualOptions = ActorProps & TaggableOptions & IndividualProps;

import { ActorProps, IndividualProps } from '@okampus/shared/dtos';
import { TaggableOptions } from '../../../shards/abstract/taggable/taggable.options';

export type IndividualOptions = ActorProps & TaggableOptions & IndividualProps;

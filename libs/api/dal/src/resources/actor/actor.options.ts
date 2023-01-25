import { ActorProps } from '@okampus/shared/dtos';
import { Either } from '@okampus/shared/types';
import { TaggableOptions } from '../../shards/abstract/taggable/taggable.options';
import type { Org } from '../org/org.entity';
import type { Individual } from './individual/individual.entity';

export type ActorOptions = ActorProps & TaggableOptions & Either<{ org: Org }, { individual: Individual }>;

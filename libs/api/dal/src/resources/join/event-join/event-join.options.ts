import type { JoinOptions } from '../join.options';
import type { EventJoinProps } from '@okampus/shared/dtos';
import type { TenantEvent } from '../../content-master/event/event.entity';

export type EventJoinOptions = EventJoinProps &
  JoinOptions & {
    event: TenantEvent;
  };

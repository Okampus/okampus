import type { ITenantEvent } from '../../content-master/event/event.interface';
import type { ITeamAction } from '../../manage-team/team-action/team-action.interface';
import type { IJoin } from '../join.interface';
import type { EventJoinProps } from './event-join.props';

export type IEventJoin = IJoin &
  EventJoinProps & {
    event?: ITenantEvent;
    participated: boolean | null;
    teamAction?: ITeamAction | null;
  };

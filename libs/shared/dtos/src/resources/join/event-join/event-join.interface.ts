import { ITenantEvent } from '../../content-master/event/event.interface';
import { ITeamAction } from '../../manage-team/team-action/team-action.interface';
import { IJoin } from '../join.interface';
import { EventJoinProps } from './event-join.props';

export type IEventJoin = IJoin &
  EventJoinProps & {
    event?: ITenantEvent;
    participated: boolean | null;
    teamAction?: ITeamAction | null;
  };

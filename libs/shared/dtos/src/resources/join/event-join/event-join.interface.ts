import type { ITenantEvent } from '../../content-master/event/event.interface';
import type { ITeamAction } from '../../manage-team/team-action/team-action.interface';
import type { IEventRole } from '../../role/event-role/event-role.interface';
import type { IJoin } from '../join.interface';
import type { EventJoinProps } from './event-join.props';

export type IEventJoin = IJoin &
  EventJoinProps & {
    linkedEvent?: ITenantEvent;
    eventRole?: IEventRole | null;
    participated: boolean | null;
    teamAction?: ITeamAction | null;
  };

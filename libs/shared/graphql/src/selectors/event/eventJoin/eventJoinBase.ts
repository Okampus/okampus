import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { userBaseInfo } from '../../individual/userBase';
import { eventAttendanceBaseInfo } from '../eventAttendance/eventAttendance';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventJoinBaseInfo = Selector('EventJoin')({
  ...entityBase,
  userInfo: userBaseInfo,
  state: true,
  attendanceStatus: true,
  eventAttendances: [{}, eventAttendanceBaseInfo],
});
export type EventJoinBaseInfo = InputType<GraphQLTypes['EventJoin'], typeof eventJoinBaseInfo>;

import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { individualBaseInfo } from '../../individual/individualBase';
import { userBaseInfo } from '../../individual/userBase';
import type { GraphQLTypes, InputType } from '../../../zeus';

export const eventAttendanceBaseInfo = Selector('EventAttendance')({
  ...entityBase,
  createdAt: true,
  confirmedVia: true,
  participated: true,
  individual: {
    ...individualBaseInfo,
    userInfo: userBaseInfo,
  },
});
export type EventAttendanceBaseInfo = InputType<GraphQLTypes['EventAttendance'], typeof eventAttendanceBaseInfo>;

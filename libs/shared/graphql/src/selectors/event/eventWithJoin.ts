import { eventBaseInfo } from './eventBase';
import { eventJoinBaseInfo } from './eventJoin/eventJoinBase';
import { Selector } from '../../zeus';
import { formBaseInfo } from '../form/formBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const eventWithJoinInfo = Selector('Event')({
  ...eventBaseInfo,
  eventJoins: [{}, eventJoinBaseInfo],
  form: formBaseInfo,
});
export type EventWithJoinInfo = InputType<GraphQLTypes['Event'], typeof eventWithJoinInfo>;

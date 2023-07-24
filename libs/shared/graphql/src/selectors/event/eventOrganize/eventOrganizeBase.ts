import { eventOrganizeMinimalInfo } from './eventOrganizeMinimal';
import { eventBaseInfo } from '../eventBase';
import { Selector } from '../../../zeus';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventOrganizeBaseInfo = Selector('EventOrganize')({
  ...eventOrganizeMinimalInfo,
  event: eventBaseInfo,
});
export type EventOrganizeBaseInfo = InputType<GraphQLTypes['EventOrganize'], typeof eventOrganizeBaseInfo>;

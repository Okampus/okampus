import { eventManageMinimalInfo } from './eventManageMinimal';
import { eventBaseInfo } from '../eventBase';
import { Selector } from '../../../zeus';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventManageBaseInfo = Selector('EventOrganize')({
  ...eventManageMinimalInfo,
  event: eventBaseInfo,
});
export type EventOrganizeBaseInfo = InputType<GraphQLTypes['EventOrganize'], typeof eventManageBaseInfo>;

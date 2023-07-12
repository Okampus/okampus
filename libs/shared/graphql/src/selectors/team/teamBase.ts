import { poleBaseInfo } from './pole/poleBase';
import { formBaseInfo } from '../form/formBase';
import { Selector } from '../../zeus';

import { actorBaseInfo } from '../actor/actorBase';
import { entityBase } from '../entityBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const teamBaseInfo = Selector('Team')({
  ...entityBase,
  type: true,
  actor: actorBaseInfo,
  directorsCategoryName: true,
  managersCategoryName: true,
  membersCategoryName: true,
  joinForm: formBaseInfo,
  teamMembersAggregate: [{}, { aggregate: { count: [{}, true] } }],
  poles: [{}, poleBaseInfo],
  tenantId: true,
});
export type TeamBaseInfo = InputType<GraphQLTypes['Team'], typeof teamBaseInfo>;

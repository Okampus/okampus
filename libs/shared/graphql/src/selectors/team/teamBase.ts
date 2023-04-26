import { poleBaseInfo } from './pole/poleBase';
import { formBaseInfo } from '../form/formBase';
import { Selector } from '../../zeus';

import { uploadBaseInfo } from '../upload/uploadBase';
import { actorBaseInfo } from '../actor/actorBase';
import { tagBaseInfo } from '../actor/tag/tagBase';
import { entityBase } from '../entityBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const teamBaseInfo = Selector('Team')({
  ...entityBase,
  tenantId: true,
  type: true,
  tagline: true,
  actor: actorBaseInfo,
  directorsCategoryName: true,
  managersCategoryName: true,
  membersCategoryName: true,
  form: formBaseInfo,
  teamCategories: [{}, { tag: { ...tagBaseInfo, upload: uploadBaseInfo } }],
  teamMembersAggregate: [{}, { aggregate: { count: [{}, true] } }],
  poles: [{}, poleBaseInfo],
});
export type TeamBaseInfo = InputType<GraphQLTypes['Team'], typeof teamBaseInfo>;

import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { projectMinimalInfo } from '../../project/projectMinimal';
import { teamBaseInfo } from '../../team/teamBase';
import { teamMemberWithUser } from '../../team/teamMember/teamMemberWithUser';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventManageMinimalInfo = Selector('EventManage')({
  ...entityBase,
  team: teamBaseInfo,
  project: projectMinimalInfo,
  supervisors: [{}, { teamMember: teamMemberWithUser }],
});
export type EventManageMinimalInfo = InputType<GraphQLTypes['EventManage'], typeof eventManageMinimalInfo>;

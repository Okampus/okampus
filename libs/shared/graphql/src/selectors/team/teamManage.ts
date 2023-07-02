import { teamWithMembersInfo } from './teamWithMembers';
import { accountBaseInfo } from './account/accountBase';
import { accountAllocateBaseInfo } from './accountAllocate/accountAllocateBase';
import { teamMinimalInfo } from './teamMinimal';

import { Selector } from '../../zeus';
import { eventBaseInfo } from '../event/eventBase';
import { projectBaseInfo } from '../project/projectBase';

import { entityBase } from '../entityBase';
import { TeamHistoryEventType } from '@okampus/shared/enums';
import type { InputType, GraphQLTypes } from '../../zeus';

const _in = [
  TeamHistoryEventType.OkampusStart,
  TeamHistoryEventType.ExtraordinaryAssembly,
  TeamHistoryEventType.RegularAssembly,
  TeamHistoryEventType.Restart,
];
export const teamManageInfo = Selector('Team')({
  ...teamWithMembersInfo,
  eventManages: [{}, { event: eventBaseInfo }],
  projects: [{}, projectBaseInfo],
  membershipDuration: true,
  membershipFees: true,
  isJoinFormActive: true,
  accounts: [{}, accountBaseInfo],
  accountAllocates: [{}, accountAllocateBaseInfo],
  teamHistories: [{ where: { eventType: { _in } } }, { ...entityBase, eventDate: true }],
  teams: [{}, teamMinimalInfo],
});
export type TeamManageInfo = InputType<GraphQLTypes['Team'], typeof teamManageInfo>;

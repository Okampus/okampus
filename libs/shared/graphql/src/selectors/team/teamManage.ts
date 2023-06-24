import { teamWithMembersInfo } from './teamWithMembers';
import { Selector } from '../../zeus';
import { eventBaseInfo } from '../event/eventBase';
import { projectBaseInfo } from '../project/projectBase';

import { entityBase } from '../entityBase';
import { TeamHistoryEventType } from '@okampus/shared/enums';
import type { InputType, GraphQLTypes } from '../../zeus';

export const teamManageInfo = Selector('Team')({
  ...teamWithMembersInfo,
  currentFinance: true,
  eventManages: [{}, { event: eventBaseInfo }],
  projects: [{}, projectBaseInfo],
  membershipDuration: true,
  membershipFees: true,
  isJoinFormActive: true,
  teamHistories: [
    {
      where: {
        eventType: {
          _in: [
            TeamHistoryEventType.OkampusStart,
            TeamHistoryEventType.ExtraordinaryAssembly,
            TeamHistoryEventType.RegularAssembly,
            TeamHistoryEventType.Restart,
          ],
        },
      },
    },
    { ...entityBase, eventDate: true },
  ],
});
export type TeamManageInfo = InputType<GraphQLTypes['Team'], typeof teamManageInfo>;

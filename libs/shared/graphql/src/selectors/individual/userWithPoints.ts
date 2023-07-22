import { userBaseInfo } from './userBase';
import { Selector } from '../../zeus';

import type { InputType, GraphQLTypes } from '../../zeus';

export const generateUserWithPointsInfoSelector = (teamId: string | undefined) =>
  Selector('User')({
    ...userBaseInfo,
    eventJoins: [
      {
        where: { participationProcessedAt: { _isNull: false }, event: { eventOrganizes: { teamId: { _eq: teamId } } } },
      },
      { event: { pointsAwardedForAttendance: true }, processedAt: true },
    ],
    actions: [
      { where: { pointsProcessedAt: { _isNull: false }, teamId: { _eq: teamId } } },
      { points: true, pointsProcessedAt: true },
    ],
    missionJoins: [
      { where: { pointsProcessedAt: { _isNull: false }, mission: { teamId: { _eq: teamId } } } },
      { points: true, pointsProcessedAt: true },
    ],
  });
export type UserWithPointsInfo = InputType<GraphQLTypes['User'], ReturnType<typeof generateUserWithPointsInfoSelector>>;

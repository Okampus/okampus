import { eventJoinMinimalInfo } from './eventJoin/eventJoinMinimal';
import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import { locationBaseInfo } from '../actor/location/locationBase';
import { tagBaseInfo } from '../actor/tag/tagBase';
import { contentBaseInfo } from '../content/contentBase';
import { fileUploadBaseInfo } from '../fileUpload/fileUploadBase';
import { projectMinimalInfo } from '../project/projectMinimal';
import { teamBaseInfo } from '../team/teamBase';
import { teamMemberWithUser } from '../team/teamMember/teamMemberWithUser';

import { ApprovalState } from '@okampus/shared/enums';

import type { GraphQLTypes, InputType } from '../../zeus';

export const eventBaseInfo = Selector('Event')({
  ...entityBase,
  start: true,
  end: true,
  name: true,
  slug: true,
  content: contentBaseInfo,
  location: locationBaseInfo,
  state: true,
  price: true,
  pointsAwardedForAttendance: true,
  banner: fileUploadBaseInfo,
  isPrivate: true,
  eventTags: [{}, { tag: tagBaseInfo }],
  eventOrganizes: [
    {},
    { team: teamBaseInfo, project: projectMinimalInfo, supervisors: [{}, { teamMember: teamMemberWithUser }] },
  ],
  eventJoinsAggregate: [{ where: { state: { _eq: ApprovalState.Approved } } }, { aggregate: { count: [{}, true] } }],
  eventJoins: [{ where: { state: { _eq: ApprovalState.Approved } }, limit: 3 }, eventJoinMinimalInfo],
});
export type EventBaseInfo = InputType<GraphQLTypes['Event'], typeof eventBaseInfo>;

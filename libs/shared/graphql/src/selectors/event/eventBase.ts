import { Selector } from '../../zeus';
import { fileUploadBaseInfo } from '../fileUpload/fileUploadBase';
import { entityBase } from '../entityBase';
import { teamBaseInfo } from '../team/teamBase';
import { projectMinimalInfo } from '../project/projectMinimal';
import { contentBaseInfo } from '../content/contentBase';
import { locationBaseInfo } from '../actor/location/locationBase';

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
  pointsPresence: true,
  banner: fileUploadBaseInfo,
  isPrivate: true,
  project: projectMinimalInfo,
  eventManages: [{}, { team: teamBaseInfo }],
  eventJoinsAggregate: [{ where: { state: { _eq: ApprovalState.Approved } } }, { aggregate: { count: [{}, true] } }],
});
export type EventBaseInfo = InputType<GraphQLTypes['Event'], typeof eventBaseInfo>;

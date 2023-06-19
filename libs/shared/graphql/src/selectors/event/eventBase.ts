import { Selector } from '../../zeus';
import { fileUploadBaseInfo } from '../fileUpload/fileUploadBase';
import { entityBase } from '../entityBase';
import { actorAddressBaseInfo } from '../actor/actorAddress/actorAddressBase';
import { teamBaseInfo } from '../team/teamBase';
import { projectMinimalInfo } from '../project/projectMinimal';

import { contentBaseInfo } from '../content/contentBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const eventBaseInfo = Selector('Event')({
  ...entityBase,
  start: true,
  end: true,
  name: true,
  slug: true,
  content: contentBaseInfo,
  actorAddress: actorAddressBaseInfo,
  state: true,
  price: true,
  pointsPresence: true,
  fileUpload: fileUploadBaseInfo,
  isPrivate: true,
  project: projectMinimalInfo,
  teamEvents: [{}, { team: teamBaseInfo }],
});
export type EventBaseInfo = InputType<GraphQLTypes['Event'], typeof eventBaseInfo>;

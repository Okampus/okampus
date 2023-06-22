import { Selector } from '../../zeus';
import { fileUploadBaseInfo } from '../fileUpload/fileUploadBase';
import { entityBase } from '../entityBase';
import { addressBaseInfo } from '../actor/address/addressBase';
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
  address: addressBaseInfo,
  state: true,
  price: true,
  pointsPresence: true,
  banner: fileUploadBaseInfo,
  isPrivate: true,
  project: projectMinimalInfo,
  eventManages: [{}, { team: teamBaseInfo }],
});
export type EventBaseInfo = InputType<GraphQLTypes['Event'], typeof eventBaseInfo>;

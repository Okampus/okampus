import { Selector } from '../../zeus';
import { fileUploadBaseInfo } from '../file-upload/fileUploadBase';
import { contentMasterBaseInfo } from '../contentMaster/contentMasterBase';
import { entityBase } from '../entityBase';
import { actorAddressBaseInfo } from '../actor/actorAddress/actorAddressBase';
import { teamBaseInfo } from '../team/teamBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const eventBaseInfo = Selector('Event')({
  ...entityBase,
  start: true,
  end: true,
  actorAddress: actorAddressBaseInfo,
  state: true,
  price: true,
  presenceReward: true,
  contentMaster: contentMasterBaseInfo,
  fileUpload: fileUploadBaseInfo,
  isPrivate: true,
  teamEvents: [
    {},
    {
      team: teamBaseInfo,
    },
  ],
});
export type EventBaseInfo = InputType<GraphQLTypes['Event'], typeof eventBaseInfo>;

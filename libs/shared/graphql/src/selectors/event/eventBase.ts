import { Selector } from '../../zeus';
import { uploadBaseInfo } from '../upload/uploadBase';
import { contentMasterBaseInfo } from '../contentMaster/contentMasterBase';
import { entityBase } from '../entityBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const eventBaseInfo = Selector('Event')({
  ...entityBase,
  start: true,
  end: true,
  state: true,
  price: true,
  contentMaster: contentMasterBaseInfo,
  upload: uploadBaseInfo,
  isPrivate: true,
  // form: formBaseInfo,
});
export type EventBaseInfo = InputType<GraphQLTypes['Event'], typeof eventBaseInfo>;

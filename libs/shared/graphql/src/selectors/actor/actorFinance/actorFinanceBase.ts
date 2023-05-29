import { Selector } from '../../../zeus';

import { actorAddressBaseInfo } from '../actorAddress/actorAddressBase';
import { actorBaseInfo } from '../actorBase';
import { fileUploadBaseInfo } from '../../file-upload/fileUploadBase';
import { entityBase } from '../../entityBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const actorFinanceBaseInfo = Selector('ActorFinance')({
  ...entityBase,
  payedAt: true,
  actor: actorBaseInfo,
  actorAddress: actorAddressBaseInfo,
  amount: true,
  name: true,
  category: true,
  fileUpload: fileUploadBaseInfo,
});
export type ActorFinanceBaseInfo = InputType<GraphQLTypes['ActorFinance'], typeof actorFinanceBaseInfo>;

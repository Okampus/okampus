import { Selector } from '../../../zeus';
import { projectBaseInfo } from '../../project/projectBase';
import { entityBase } from '../../entityBase';
import { eventBaseInfo } from '../../event/eventBase';
import { addressBaseInfo } from '../../actor/address/addressBase';
import { actorBaseInfo } from '../../actor/actorBase';
import { fileUploadBaseInfo } from '../../fileUpload/fileUploadBase';
import { individualBaseInfo } from '../../individual/individualBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const financeBaseInfo = Selector('Finance')({
  ...entityBase,
  payedAt: true,
  actor: actorBaseInfo,
  address: addressBaseInfo,
  financeAttachments: [{}, { fileUpload: fileUploadBaseInfo }],
  amount: true,
  name: true,
  category: true,
  project: projectBaseInfo,
  event: eventBaseInfo,
  method: true,
  createdBy: individualBaseInfo,
});
export type FinanceBaseInfo = InputType<GraphQLTypes['Finance'], typeof financeBaseInfo>;

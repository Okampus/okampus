import { Selector } from '../../../zeus';
import { projectBaseInfo } from '../../project/projectBase';
import { entityBase } from '../../entityBase';
import { eventBaseInfo } from '../../event/eventBase';
import { actorAddressBaseInfo } from '../../actor/actorAddress/actorAddressBase';
import { actorBaseInfo } from '../../actor/actorBase';
import { fileUploadBaseInfo } from '../../file-upload/fileUploadBase';
import { individualBaseInfo } from '../../individual/individualBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamFinanceBaseInfo = Selector('TeamFinance')({
  ...entityBase,
  payedAt: true,
  actor: actorBaseInfo,
  actorAddress: actorAddressBaseInfo,
  fileUpload: fileUploadBaseInfo,
  amount: true,
  name: true,
  category: true,
  project: projectBaseInfo,
  event: eventBaseInfo,
  method: true,
  individual: individualBaseInfo,
});
export type TeamFinanceBaseInfo = InputType<GraphQLTypes['TeamFinance'], typeof teamFinanceBaseInfo>;

import { Selector } from '../../../zeus';
import { projectBaseInfo } from '../../project/projectBase';
import { entityBase } from '../../entityBase';
import { eventBaseInfo } from '../../event/eventBase';
import { actorAddressBaseInfo } from '../../actor/actorAddress/actorAddressBase';
import { actorBaseInfo } from '../../actor/actorBase';
import { fileUploadBaseInfo } from '../../file-upload/fileUploadBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamFinanceEditBaseInfo = Selector('TeamFinanceEdit')({
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
});
export type TeamFinanceBaseEditInfo = InputType<GraphQLTypes['TeamFinanceEdit'], typeof teamFinanceEditBaseInfo>;

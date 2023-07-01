import { Selector } from '../../../zeus';
import { projectBaseInfo } from '../../project/projectBase';
import { entityBase } from '../../entityBase';
import { eventBaseInfo } from '../../event/eventBase';
import { fileUploadBaseInfo } from '../../fileUpload/fileUploadBase';
import { individualBaseInfo } from '../../individual/individualBase';
import { actorWithTeamInfo } from '../../actor/actorWithTeam';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const financeBaseInfo = Selector('Finance')({
  ...entityBase,
  payedAt: true,
  payedBy: actorWithTeamInfo,
  receivedBy: actorWithTeamInfo,
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

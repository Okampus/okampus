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
  initiatedBy: individualBaseInfo,
  receivedBy: actorWithTeamInfo,
  financeAttachments: [{}, { fileUpload: fileUploadBaseInfo }],
  amount: true,
  category: true,
  method: true,
  project: projectBaseInfo,
  event: eventBaseInfo,
  createdBy: individualBaseInfo,
});
export type FinanceBaseInfo = InputType<GraphQLTypes['Finance'], typeof financeBaseInfo>;

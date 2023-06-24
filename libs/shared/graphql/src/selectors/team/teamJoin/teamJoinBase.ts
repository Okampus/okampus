import { Selector } from '../../../zeus';
import { formSubmissionBaseInfo } from '../../formSubmission/formSubmissionBase';
import { individualBaseInfo } from '../../individual/individualBase';
import { roleBaseInfo } from '../role/roleBase';
import { entityBase } from '../../entityBase';
import { userBaseInfo } from '../../individual/userBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamJoinBaseInfo = Selector('TeamJoin')({
  ...entityBase,
  state: true,
  team: entityBase,
  receivedRole: roleBaseInfo,
  formSubmission: formSubmissionBaseInfo,
  createdBy: individualBaseInfo,
  joiner: userBaseInfo,
});
export type TeamJoinBaseInfo = InputType<GraphQLTypes['TeamJoin'], typeof teamJoinBaseInfo>;

import { Selector } from '../../../zeus';
import { formSubmissionBaseInfo } from '../../formSubmission/formSubmissionBase';
import { individualBaseInfo } from '../../individual/individualBase';
import { roleBaseInfo } from '../role/roleBase';
import { entityBase } from '../../entityBase';
import { changeRoleBaseInfo } from '../changeRole/changeRoleBase';
import { userBaseInfo } from '../../individual/userBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamJoinBaseInfo = Selector('TeamJoin')({
  ...entityBase,
  state: true,
  team: entityBase,
  role: roleBaseInfo,
  changeRole: changeRoleBaseInfo,
  formSubmission: formSubmissionBaseInfo,
  individual: individualBaseInfo,
  userInfo: userBaseInfo,
});
export type TeamJoinBaseInfo = InputType<GraphQLTypes['TeamJoin'], typeof teamJoinBaseInfo>;

import { Selector } from '../../../zeus';
import { formSubmissionBaseInfo } from '../../formSubmission/formSubmissionBase';
import { individualBaseInfo } from '../../individual/individualBase';
import { roleBaseInfo } from '../role/roleBase';
import { entityBase } from '../../entityBase';
import { teamChangeRoleBaseInfo } from '../teamChangeRole/teamChangeRoleBase';
import { userBaseInfo } from '../../individual/userBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamJoinBaseInfo = Selector('TeamJoin')({
  ...entityBase,
  state: true,
  role: roleBaseInfo,
  individual: individualBaseInfo,
  teamChangeRole: teamChangeRoleBaseInfo,
  formSubmission: formSubmissionBaseInfo,
  userInfo: userBaseInfo,
  team: entityBase,
});
export type TeamJoinBaseInfo = InputType<GraphQLTypes['TeamJoin'], typeof teamJoinBaseInfo>;

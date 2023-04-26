import { Selector } from '../../../zeus';
import { roleBaseInfo } from '../role/roleBase';
import { poleBaseInfo } from '../pole/poleBase';
import { individualBaseInfo } from '../../individual/individualBase';
import { entityBase } from '../../entityBase';
import { userBaseInfo } from '../../individual/userBase';
import type { GraphQLTypes, InputType } from '../../../zeus';

export const teamChangeRoleBaseInfo = Selector('TeamChangeRole')({
  ...entityBase,
  role: roleBaseInfo,
  pole: poleBaseInfo,
  userInfo: userBaseInfo,
  individual: individualBaseInfo, // <=> createdBy = settledBy
});
export type TeamChangeRoleBaseInfo = InputType<GraphQLTypes['TeamChangeRole'], typeof teamChangeRoleBaseInfo>;

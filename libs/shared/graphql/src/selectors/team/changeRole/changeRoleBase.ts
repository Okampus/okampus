import { Selector } from '../../../zeus';
import { roleBaseInfo } from '../role/roleBase';
import { poleBaseInfo } from '../pole/poleBase';
import { individualBaseInfo } from '../../individual/individualBase';
import { entityBase } from '../../entityBase';
import { userBaseInfo } from '../../individual/userBase';
import type { GraphQLTypes, InputType } from '../../../zeus';

export const changeRoleBaseInfo = Selector('ChangeRole')({
  ...entityBase,
  role: roleBaseInfo,
  pole: poleBaseInfo,
  userInfo: userBaseInfo,
  individual: individualBaseInfo, // <=> createdBy = settledBy
});
export type ChangeRoleBaseInfo = InputType<GraphQLTypes['ChangeRole'], typeof changeRoleBaseInfo>;

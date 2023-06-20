import { tenantBaseInfo } from './tenantBase';
import { Selector } from '../../zeus';
import { documentBaseInfo } from '../document/documentBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantWithDocumentsInfo = Selector('Tenant')({
  ...tenantBaseInfo,
  adminTeam: {
    ...tenantBaseInfo.adminTeam,
    documents: [{}, documentBaseInfo],
  },
});
export type TenantWithDocumentsInfo = InputType<GraphQLTypes['Tenant'], typeof tenantWithDocumentsInfo>;

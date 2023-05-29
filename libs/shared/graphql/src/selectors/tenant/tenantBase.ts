import { fileUploadBaseInfo } from '../file-upload/fileUploadBase';
import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantBaseInfo = Selector('Tenant')({
  ...entityBase,
  name: true,
  pointName: true,
  fileUpload: fileUploadBaseInfo,
});
export type TenantBaseInfo = InputType<GraphQLTypes['Tenant'], typeof tenantBaseInfo>;

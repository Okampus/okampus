import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const fileUploadBaseInfo = Selector('FileUpload')({
  ...entityBase,
  name: true,
  type: true,
  url: true,
  size: true,
});
export type FileUploadBaseInfo = InputType<GraphQLTypes['FileUpload'], typeof fileUploadBaseInfo>;

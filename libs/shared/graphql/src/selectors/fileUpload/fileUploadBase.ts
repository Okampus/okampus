import { fileUploadMinimalInfo } from './fileUploadMinimal';
import { Selector } from '../../zeus';

import type { GraphQLTypes, InputType } from '../../zeus';

export const fileUploadBaseInfo = Selector('FileUpload')({
  ...fileUploadMinimalInfo,
  name: true,
});
export type FileUploadBaseInfo = InputType<GraphQLTypes['FileUpload'], typeof fileUploadBaseInfo>;

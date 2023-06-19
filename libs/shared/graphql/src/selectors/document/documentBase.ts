import { Selector } from '../../zeus';
import { fileUploadBaseInfo } from '../fileUpload/fileUploadBase';
import { entityBase } from '../entityBase';
import type { InputType, GraphQLTypes } from '../../zeus';

export const documentBaseInfo = Selector('Document')({
  ...entityBase,
  description: true,
  name: true,
  type: true,
  yearVersion: true,
  fileUpload: fileUploadBaseInfo,
});
export type DocumentBaseInfo = InputType<GraphQLTypes['Document'], typeof documentBaseInfo>;

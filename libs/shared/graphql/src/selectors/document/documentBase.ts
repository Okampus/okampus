import { Selector } from '../../zeus';
import { uploadBaseInfo } from '../upload/uploadBase';
import { entityBase } from '../entityBase';
import type { InputType, GraphQLTypes } from '../../zeus';

export const documentBaseInfo = Selector('Document')({
  ...entityBase,
  description: true,
  name: true,
  type: true,
  yearVersion: true,
  upload: uploadBaseInfo,
});
export type DocumentBaseInfo = InputType<GraphQLTypes['Document'], typeof documentBaseInfo>;

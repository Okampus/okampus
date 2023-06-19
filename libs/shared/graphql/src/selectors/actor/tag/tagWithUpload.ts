import { tagBaseInfo } from './tagBase';
import { Selector } from '../../../zeus';
import { fileUploadBaseInfo } from '../../fileUpload/fileUploadBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const tagWithUploadInfo = Selector('Tag')({
  ...tagBaseInfo,
  fileUpload: fileUploadBaseInfo,
});
export type TagWithUploadInfo = InputType<GraphQLTypes['Tag'], typeof tagWithUploadInfo>;

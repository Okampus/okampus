import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { fileUploadMinimalInfo } from '../../fileUpload/fileUploadMinimal';
import type { GraphQLTypes, InputType } from '../../../zeus';

export const actorImageBaseInfo = Selector('ActorImage')({
  ...entityBase,
  type: true,
  image: fileUploadMinimalInfo,
});
export type ActorImageBaseInfo = InputType<GraphQLTypes['ActorImage'], typeof actorImageBaseInfo>;

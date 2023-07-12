import { fileUploadBaseInfo } from '../../fileUpload/fileUploadBase';
import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import type { GraphQLTypes, InputType } from '../../../zeus';

export const actorImageBaseInfo = Selector('ActorImage')({
  ...entityBase,
  type: true,
  lastActiveDate: true,
  image: fileUploadBaseInfo,
});
export type ActorImageBaseInfo = InputType<GraphQLTypes['ActorImage'], typeof actorImageBaseInfo>;

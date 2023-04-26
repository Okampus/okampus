import { uploadBaseInfo } from '../../upload/uploadBase';
import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import type { GraphQLTypes, InputType } from '../../../zeus';

export const actorImageBaseInfo = Selector('ActorImage')({
  ...entityBase,
  type: true,
  upload: uploadBaseInfo,
});
export type ActorImageBaseInfo = InputType<GraphQLTypes['ActorImage'], typeof actorImageBaseInfo>;

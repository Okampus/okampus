import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const uploadBaseInfo = Selector('Upload')({
  ...entityBase,
  mime: true,
  url: true,
  size: true,
});
export type UploadBaseInfo = InputType<GraphQLTypes['Upload'], typeof uploadBaseInfo>;

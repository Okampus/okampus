import { Selector } from '../../zeus';
import { contentBaseInfo } from '../content/contentBase';
import { entityBase } from '../entityBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const contentMasterBaseInfo = Selector('ContentMaster')({
  ...entityBase,
  name: true,
  slug: true,
  content: contentBaseInfo,
});
export type ContentMasterBaseInfo = InputType<GraphQLTypes['ContentMaster'], typeof contentMasterBaseInfo>;

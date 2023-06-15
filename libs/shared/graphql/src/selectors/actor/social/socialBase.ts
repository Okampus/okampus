import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const socialBaseInfo = Selector('Social')({
  ...entityBase,
  pseudo: true,
  url: true,
  type: true,
  order: true,
});
export type SocialBaseInfo = InputType<GraphQLTypes['Social'], typeof socialBaseInfo>;

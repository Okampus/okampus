import { actorImageBaseInfo } from './actorImage/actorImageBase';
import { tagBaseInfo } from './tag/tagBase';
import { socialBaseInfo } from './social/socialBase';
import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const actorBaseInfo = Selector('Actor')({
  ...entityBase,
  individualByIndividualId: { userInfo: { id: true } },
  team: { id: true },
  bio: true,
  name: true,
  slug: true,
  status: true,
  email: true,
  actorImages: [{ where: { lastActiveDate: { _isNull: true } } }, actorImageBaseInfo],
  actorTags: [{}, { tag: tagBaseInfo }],
  socials: [{}, socialBaseInfo],
});
export type ActorBaseInfo = InputType<GraphQLTypes['Actor'], typeof actorBaseInfo>;

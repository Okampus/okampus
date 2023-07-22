import { actorMinimalInfo } from './actorMinimal';
import { tagBaseInfo } from './tag/tagBase';
import { socialBaseInfo } from './social/socialBase';
import { Selector } from '../../zeus';

import type { InputType, GraphQLTypes } from '../../zeus';

export const actorBaseInfo = Selector('Actor')({
  ...actorMinimalInfo,
  bio: true,
  status: true,
  email: true,
  actorTags: [{}, { tag: tagBaseInfo }],
  socials: [{ where: { deletedAt: { _isNull: true } } }, socialBaseInfo],
});
export type ActorBaseInfo = InputType<GraphQLTypes['Actor'], typeof actorBaseInfo>;

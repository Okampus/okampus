import { actorMinimalInfo } from './actorMinimal';
import { tagBaseInfo } from './tag/tagBase';
import { socialBaseInfo } from './social/socialBase';
import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const actorBaseInfo = Selector('Actor')({
  ...actorMinimalInfo,
  team: entityBase,
  individual: { user: entityBase, bot: entityBase },
  bio: true,
  slug: true,
  status: true,
  email: true,
  actorTags: [{}, { tag: tagBaseInfo }],
  socials: [{}, socialBaseInfo],
});
export type ActorBaseInfo = InputType<GraphQLTypes['Actor'], typeof actorBaseInfo>;

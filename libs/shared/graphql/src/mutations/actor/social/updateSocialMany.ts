import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { socialBaseInfo } from '../../../selectors/actor/social/socialBase';

import type { ResolverInputTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const updateSocialManyMutation = typedGql('mutation')({
  updateSocialMany: [
    { updates: $('updates', '[SocialUpdates!]!') as unknown as Array<ResolverInputTypes['SocialUpdates']> },
    { returning: socialBaseInfo },
  ],
});

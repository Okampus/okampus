import { $ } from '../../../zeus';
import { socialBaseInfo } from '../../../selectors/actor/social/socialBase';
import { typedGql } from '../../../zeus/typedDocumentNode';

import type { ResolverInputTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const deleteSocialManyMutation = typedGql('mutation')({
  deleteSocial: [
    { where: $('where', 'SocialBoolExp!') as ResolverInputTypes['SocialBoolExp'] },
    { returning: socialBaseInfo },
  ],
});

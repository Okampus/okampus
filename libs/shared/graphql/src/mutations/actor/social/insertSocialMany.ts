import { $ } from '../../../zeus';
import { socialBaseInfo } from '../../../selectors/actor/social/socialBase';
import { typedGql } from '../../../zeus/typedDocumentNode';

import type { ResolverInputTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertSocialManyMutation = typedGql('mutation')({
  insertSocial: [
    { objects: $('objects', '[SocialInsertInput!]!') as unknown as Array<ResolverInputTypes['SocialInsertInput']> },
    { returning: socialBaseInfo },
  ],
});

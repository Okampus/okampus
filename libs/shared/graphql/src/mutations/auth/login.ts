import { userMeInfo } from '../../selectors/individual/userMe';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../zeus';

// @ts-expect-error - Zeus depth limit
export const loginMutation = typedGql('mutation')({
  login: [{ dto: $('dto', 'LoginInput!') as unknown as ValueTypes['LoginInput'] }, userMeInfo],
});

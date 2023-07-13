import { userMeInfo } from '../../selectors/individual/userMe';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const loginMutation = typedGql('mutation')({
  login: [
    { dto: $('dto', 'LoginInput!') as unknown as ValueTypes['LoginInput'] },
    { user: userMeInfo, canManageTenant: true },
  ],
});

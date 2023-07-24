import { userLoginInfo } from '../../selectors/individual/userLogin';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../zeus';

// @ts-ignore
export const loginMutation = typedGql('mutation')({
  login: [{ dto: $('dto', 'LoginInput!') as unknown as ValueTypes['LoginInput'] }, userLoginInfo],
});

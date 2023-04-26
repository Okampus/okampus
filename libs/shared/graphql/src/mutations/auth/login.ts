import { userMeInfo } from '../../selectors/individual/userMe';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';

// @ts-expect-error - Zeus depth limit
export const login = typedGql('mutation')({
  login: [{ dto: $('dto', 'LoginInput!') }, userMeInfo],
});

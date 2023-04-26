import { userMeInfo } from '../../selectors/individual/userMe';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';

export const login = typedGql('mutation')({
  login: [{ dto: $('dto', 'LoginInput!') }, userMeInfo],
});

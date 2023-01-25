import { gql } from '@apollo/client';
import { userFragment } from '../fragments/userFragment';

export const loginMutation = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ...UserInfo
    }
  }
  ${userFragment}
`;

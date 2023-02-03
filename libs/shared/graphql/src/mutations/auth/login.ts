import { gql } from '../../schema/__generated__/gql';

export const loginMutation = gql(`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      __typename
      user {
        ...MyInfo
      }
      tenant {
        ...TenantInfo
      }
    }
  }
`);

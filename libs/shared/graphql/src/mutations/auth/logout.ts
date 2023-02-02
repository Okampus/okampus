import { gql } from '../../schema/__generated__/gql';

export const logoutMutation = gql(`
  mutation logout {
    logout
  }
`);

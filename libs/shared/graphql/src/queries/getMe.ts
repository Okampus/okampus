import { gql } from '../schema/__generated__/gql';

export const getMe = gql(`
  query me {
    me {
      user {
        ...MyInfo
      }
      tenant {
        ...TenantInfo
      }
    }
  }
`);

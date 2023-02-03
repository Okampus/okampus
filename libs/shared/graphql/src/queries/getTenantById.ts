import { gql } from '../schema/__generated__/gql';

export const getTenantByIdQuery = gql(`
  query getTenantById($id: String!) {
    tenantById(id: $id) {
      ...TenantInfo
    }
  }
`);

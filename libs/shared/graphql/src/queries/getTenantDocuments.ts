import { gql } from '../schema/__generated__/gql';

export const getTenantDocumentsQuery = gql(`
  query getTenantDocumentsQuery($id: String!) {
    tenantById(id: $id) {
      ...TenantInfo
    }
  }
`);

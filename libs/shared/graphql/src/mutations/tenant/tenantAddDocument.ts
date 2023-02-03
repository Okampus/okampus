import { gql } from '../../schema/__generated__/gql';

export const tenantAddDocumentMutation = gql(`
  mutation tenantAddDocument($tenantId: String!, $createDocument: CreateDocumentDto!, $documentFile: Upload!) {
    tenantAddDocument(tenantId: $tenantId, createDocument: $createDocument, documentFile: $documentFile) {
      __typename
      id
      org {
        id
        documents {
          id
          type
          document {
            ...DocumentInfo
          }
        }
      }
    }
  }
`);

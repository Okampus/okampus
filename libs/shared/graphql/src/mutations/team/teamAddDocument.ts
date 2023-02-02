import { gql } from '../../schema/__generated__/gql';

export const teamAddDocumentMutation = gql(`
  mutation teamAddDocument($teamId: String!, $createOrgDocument: CreateOrgDocumentDto!, $documentFile: Upload!) {
    teamAddDocument(teamId: $teamId, createOrgDocument: $createOrgDocument, documentFile: $documentFile) {
      __typename
      id
      org {
        __typename
        id
        documents {
          __typename
          id
          createdAt
          type
          document {
            ...DocumentInfo
          }
        }
      }
    }
  }
`);

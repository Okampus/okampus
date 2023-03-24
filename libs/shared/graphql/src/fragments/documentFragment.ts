import { gql } from '../schema/__generated__/gql';

export const documentFragment = gql(`
  fragment DocumentInfo on DocumentModel {
    __typename
    id
    createdAt
    updatedAt
    description
    name
    yearVersion
    current {
      ...DocumentUploadInfo
    }
    edits {
      __typename
      id
      createdAt
      ... on DocumentEditModel {
        yearVersion
      }
    }
  }
`);

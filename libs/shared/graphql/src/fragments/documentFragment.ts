import { gql } from '../schema/__generated__/gql';

export const documentFragment = gql(`
  fragment DocumentInfo on DocumentModel {
    __typename
    id
    createdAt
    updatedAt
    text
    name
    yearVersion
    documentUpload {
      ...DocumentUploadInfo
    }
    edits {
      __typename
      id
      createdAt
      yearVersion
      documentUpload {
        ...DocumentUploadInfo
      }
    }
  }
`);

import { gql } from '../schema/__generated__/gql';

export const documentUploadFragment = gql(`
  fragment DocumentUploadInfo on DocumentUploadModel {
    __typename
    id
    createdAt
    url
    name
    mime
    size
    numberOfPages
    numberOfWords
    documentType
  }
`);

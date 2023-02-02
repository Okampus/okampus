import { gql } from '../schema/__generated__/gql';

export const fileUploadFragment = gql(`
  fragment FileInfo on FileUploadModel {
    __typename
    id
    createdAt
    url
    name
    mime
    size
  }
`);

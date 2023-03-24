import { gql } from '../schema/__generated__/gql';

export const formFragment = gql(`
  fragment FormInfo on FormModel {
    __typename
    id
    createdAt
    updatedAt
    name
    description
    schema
    type
    isTemplate
    edits {
      __typename
      id
      createdAt
      ... on FormEditModel {
        newVersion
      }
    }
  }
`);

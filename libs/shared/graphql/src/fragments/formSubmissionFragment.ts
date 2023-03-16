import { gql } from '../schema/__generated__/gql';

export const formSubmissionFragment = gql(`
  fragment FormSubmissionInfo on FormSubmissionModel {
    __typename
    id
    createdAt
    updatedAt
    submission
    description
    linkedFormEdit {
      __typename
      id
      createdAt
      updatedAt
      newVersion
    }
  }
`);

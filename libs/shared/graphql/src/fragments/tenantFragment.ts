import { gql } from '../schema/__generated__/gql';

export const tenantFragment = gql(`
  fragment TenantInfo on TenantModel {
    __typename
    id
    createdAt
    updatedAt
    actor {
      __typename
      id
      name
      slug
      actorImages {
        ...ActorImageBareInfo
      }
    }
    eventValidationForm {
      __typename
      id
      schema
    }
    documents {
      __typename
      id
      type
      document {
        ...DocumentInfo
      }
    }
  }
`);

import { gql } from '../schema/__generated__/gql';

export const orgFragment = gql(`
  fragment OrgInfo on OrgModel {
    __typename
    id
    createdAt
    updatedAt
    orgKind
    actor {
      __typename
      id
      name
      slug
      actorImages {
        ...ActorImageBareInfo
      }
    }
  }
`);

import { gql } from '../schema/__generated__/gql';

export const eventFragment = gql(`
  fragment EventInfo on TenantEventModel {
    __typename
    id
    createdAt
    updatedAt
    slug
    title
    start
    end
    state
    supervisor {
      __typename
      id
    }
    location {
      __typename
      name
      street
      city
      state
      zip
    }
    lastEventApprovalStep {
      __typename
      id
      name
      order
    }
    rootContent {
      __typename
      description
      ugcKind
      isAnonymous
      representingOrg {
        id
        createdAt
        updatedAt
        orgKind
        actor {
          id
          name
          slug
          actorImages {
            ...ActorImageBareInfo
          }
        }
      }
      author {
        ...UserInfo
      }
    }
  }
`);

import { gql } from '@apollo/client';
import { orgFragment } from './orgFragment';
import { userFragment } from './userFragment';

export const eventFragment = gql`
  fragment EventInfo on TenantEventModel {
    id
    createdAt
    updatedAt
    title
    start
    end
    state
    supervisor {
      id
    }
    location {
      street
      city
      state
      zip
    }
    lastEventApprovalStep {
      id
      name
      order
    }
    rootContent {
      ugcKind
      isAnonymous
      org {
        id
        createdAt
        updatedAt
        orgKind
        actor {
          id
          name
          slug
          actorImages {
            image {
              url
            }
            type
          }
        }
      }
      author {
        ...UserInfo
      }
      ... on ContentModel {
        text
      }
    }
  }
  ${userFragment}
`;

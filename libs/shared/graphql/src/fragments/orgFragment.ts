import { gql } from '@apollo/client';

export const orgFragment = gql`
  fragment OrgInfo on OrgModel {
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
`;

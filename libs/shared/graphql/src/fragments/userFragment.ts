import { gql } from '@apollo/client';

export const userFragment = gql`
  fragment UserInfo on UserModel {
    id
    createdAt
    updatedAt
    actor {
      slug
      name
      bio
      primaryEmail
      ical
      actorImages {
        image {
          url
        }
        type
      }
    }
    firstName
    lastName
    roles
    scopeRole
  }
`;

import { gql } from '@apollo/client';
import { eventFragment } from '../fragments/eventFragment';

export const getEventsQuery = gql`
  query {
    events {
      edges {
        node {
          ...EventInfo
        }
      }
    }
  }
  ${eventFragment}
`;

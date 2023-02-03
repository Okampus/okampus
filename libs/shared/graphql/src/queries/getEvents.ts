import { gql } from '../schema/__generated__/gql';

export const getEventsQuery = gql(`
  query getEvents {
    events {
      edges {
        node {
          ...EventInfo
        }
      }
    }
  }
`);

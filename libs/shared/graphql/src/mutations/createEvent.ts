import { gql } from '@apollo/client';
import { eventFragment } from '../fragments/eventFragment';

export const createEventMutation = gql`
  mutation createEvent($event: CreateEventDto!) {
    createEvent(event: $event) {
      ...EventInfo
    }
  }
  ${eventFragment}
`;

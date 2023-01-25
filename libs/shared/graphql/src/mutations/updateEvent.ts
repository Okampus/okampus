import { gql } from '@apollo/client';
import { eventFragment } from '../fragments/eventFragment';

export const updateEventMutation = gql`
  mutation updateEvent($updateEvent: UpdateEventDto!) {
    updateEvent(updateEvent: $updateEvent) {
      ...EventInfo
    }
  }
  ${eventFragment}
`;

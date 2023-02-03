import { gql } from '../../schema/__generated__/gql';

export const updateEventMutation = gql(`
  mutation updateEvent($updateEvent: UpdateEventDto!) {
    updateEvent(updateEvent: $updateEvent) {
      ...EventInfo
    }
  }
`);

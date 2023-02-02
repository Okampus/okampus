import { gql } from '../../schema/__generated__/gql';

export const createEventMutation = gql(`
  mutation createEvent($event: CreateEventDto!) {
    createEvent(event: $event) {
      ...EventInfo
    }
  }
`);

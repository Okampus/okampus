import { gql } from '../../schema/__generated__/gql';

export const createEventApprovalMutation = gql(`
  mutation createEventApproval($eventApproval: CreateEventApprovalDto!) {
    createEventApproval(eventApproval: $eventApproval) {
      __typename
      id
      createdAt
      updatedAt
      deletedAt
      message
      approved
      step {
        __typename
        id
        name
      }
      createdBy {
        ...UserInfo
      }
      event {
        ...EventInfo
      }
    }
  }
`);

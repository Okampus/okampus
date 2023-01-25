import { gql } from '@apollo/client';
import { eventFragment } from '../fragments/eventFragment';
import { userFragment } from '../fragments/userFragment';

export const createEventApprovalMutation = gql`
  mutation createEventApproval($eventApproval: CreateEventApprovalDto!) {
    createEventApproval(eventApproval: $eventApproval) {
      id
      createdAt
      updatedAt
      deletedAt
      message
      approved
      step {
        id
        name
      }
      createdBy {
        ...UserInfo
      }
    }
  }
  ${userFragment}
`;

import gql from 'graphql-tag'
import { partialUserFragment } from '@/graphql/fragments/userFragment'

export const getTeamRequests = gql`
    query getTeamRequests($id: Int!, $filter: FilterMembershipRequestsDto!) {
        teamMembershipRequests(id: $id, filter: $filter) {
            id
            user {
                ...PartialUserInfo
            }
            role
            state
            issuer
            originalForm {
                id
                schema
            }
            formSubmission
            createdAt
            updatedAt
        }
    }
    ${partialUserFragment}
`

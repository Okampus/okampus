import { partialUserFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

// TODO: optimize this query
export const handleRequest = gql`
    mutation handleTeamMembershipRequest($id: Int!, $updateRequest: PutTeamMembershipRequestDto!) {
        handleTeamMembershipRequest(id: $id, updateRequest: $updateRequest) {
            id
            user {
                ...PartialUserInfo
            }
            handledBy {
                ...PartialUserInfo
            }
            handledAt
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

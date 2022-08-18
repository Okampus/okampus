import { partialTeamFragment } from '@/graphql/fragments/partialTeamFragment'
import { userFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const getUser = gql`
    query userById($id: String!) {
        userById(id: $id) {
            ...UserInfo
            teamMemberships {
                role
                team {
                    ...PartialTeamInfo
                }
            }
        }
    }
    ${userFragment}
    ${partialTeamFragment}
`

export const getUserRequests = gql`
    query userById($id: String!) {
        userById(id: $id) {
            ...UserInfo
            teamMembershipRequests {
                createdAt
                role
                state
                issuer
                role
                handledBy {
                    ...UserInfo
                }
                issuedBy {
                    ...UserInfo
                }
                handledAt
                handledMessage
                formSubmission
                originalForm {
                    schema
                }
                team {
                    ...PartialTeamInfo
                }
            }
            teamMemberships {
                createdAt
                role
                team {
                    ...PartialTeamInfo
                }
            }
        }
    }
    ${userFragment}
    ${partialTeamFragment}
`

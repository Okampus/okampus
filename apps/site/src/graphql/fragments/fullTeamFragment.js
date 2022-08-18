import gql from 'graphql-tag'
import { partialUserFragment } from './userFragment'

export const fullTeamFragment = gql`
    fragment FullTeamInfo on Team {
        id
        avatar
        name
        category
        kind
        shortDescription
        longDescription
        activeMemberCount
        boardMembers {
            id
            role
            user {
                ...PartialUserInfo
            }
        }
        membershipRequestForm {
            id
            schema
        }
        userMembership {
            pendingRequest
            membership {
                role
            }
        }
    }
    ${partialUserFragment}
`

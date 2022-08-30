import gql from 'graphql-tag'
import { fileFragment } from './fileFragment'
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
        status
        presentationVideo
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
        teamFiles {
            id
            type
            description
            active
            file {
                ...FileInfo
            }
        }
    }
    ${partialUserFragment}
    ${fileFragment}
`

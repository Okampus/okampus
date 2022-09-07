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
        location
        presentationVideo
        activeMemberCount
        boardMembers {
            id
            role
            user {
                ...PartialUserInfo
            }
        }
        socials {
            id
            socialType
            link
            pseudo
        }
        labels {
            id
            name
            tooltip
            image
            type
        }
        mainGalleries {
            id
            order
            file {
                ...FileInfo
            }
        }
        membershipRequestForm {
            id
            schema
        }
        userMembership {
            pendingRequest
            membership {
                id
                role
            }
        }
        userInterest {
            id
            state
            message
        }
    }
    ${partialUserFragment}
    ${fileFragment}
`

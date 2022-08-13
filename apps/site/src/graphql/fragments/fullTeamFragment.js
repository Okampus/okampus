import gql from 'graphql-tag'

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
                id
                firstname
                lastname
                avatar
                schoolRole
            }
        }
        membershipRequestForm {
            id
            form
        }
        userMembership {
            pendingRequest
            membership {
                role
            }
        }
    }
`

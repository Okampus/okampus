import gql from 'graphql-tag'

export const fullTeamFragment = gql`
    fragment FullTeamInfo on Team {
        id
        avatar
        name
        category
        kind
        shortDescription
        activeMemberCount
        boardMembers {
            role
            user {
                lastname
                firstname
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

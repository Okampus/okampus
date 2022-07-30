import gql from 'graphql-tag'

const schoolGroupFragment = gql`
    fragment schoolGroupFragment on SchoolGroup {
        id
        name
        type
    }
`

export const userFragment = gql`
    fragment UserInfo on User {
        id
        shortDescription
        email
        points
        firstname
        lastname
        avatar
        roles
        schoolRole
        schoolGroupMemberships {
            role
            schoolYear {
                id
                name
                active
            }
            getParents {
                ...schoolGroupFragment
            }
        }
    }
    ${schoolGroupFragment}
`

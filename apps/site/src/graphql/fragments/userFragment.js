import gql from 'graphql-tag'

export const userFragment = gql`
    fragment UserInfo on User {
        id
        firstname
        lastname
        avatar
        schoolRole
    }
`

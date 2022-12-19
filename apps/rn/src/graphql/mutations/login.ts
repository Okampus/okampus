import { gql } from '@apollo/client'

export const login = gql`
    mutation ($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            name
            lastName
            email
        }
    }
`

import { gql } from '@apollo/client'

export const getUser = gql`
    query ($id: String!) {
        userById(id: $id) {
            id
            firstname
            email
        }
    }
`

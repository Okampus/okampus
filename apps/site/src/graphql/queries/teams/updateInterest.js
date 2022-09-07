import gql from 'graphql-tag'

export const updateInterest = gql`
    mutation updateInterest($id: Int!, $updateInterest: UpdateInterestDto!) {
        updateInterest(id: $id, input: $updateInterest) {
            id
            state
            message
            team {
                id
                name
            }
        }
    }
`

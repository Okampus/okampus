import gql from 'graphql-tag'

export const createInterest = gql`
    mutation createInterest($createInterest: CreateInterestDto!) {
        createInterest(input: $createInterest) {
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

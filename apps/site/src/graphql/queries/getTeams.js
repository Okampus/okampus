import gql from 'graphql-tag'

export const getTeams = gql`
    query allTeams {
        teams {
            id
            name
            category
            kind
        }
    }
`

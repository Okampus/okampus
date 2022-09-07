import gql from 'graphql-tag'

export const partialTeamFragment = gql`
    fragment PartialTeamInfo on Team {
        id
        avatar
        name
        category
        kind
        status
        location
    }
`

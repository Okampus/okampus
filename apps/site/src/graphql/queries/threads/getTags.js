import gql from 'graphql-tag'

export const getTags = gql`
    query getTags {
        tags {
            name
            color
        }
    }
`

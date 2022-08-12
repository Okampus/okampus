import gql from 'graphql-tag'

export const searchUsers = gql`
    query searchUsers($search: String!, $query: PaginateDto!) {
        searchUsers(search: $search, query: $query) {
            realId
            title
            picture
            metaType
            category
        }
    }
`

import gql from 'graphql-tag'

export const unsetLogo = gql`
    mutation unsetLogo($id: String!, $isLogoDark: Boolean!) {
        unsetLogo(id: $id, isLogoDark: $isLogoDark) {
            logo
            logoDark
        }
    }
`

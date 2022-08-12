import gql from 'graphql-tag'

export const getLogoUrls = gql`
    query getLogoUrls($id: String!) {
        getLogoUrls(id: $id) {
            id
            logoUrl
            logoDarkUrl
        }
    }
`

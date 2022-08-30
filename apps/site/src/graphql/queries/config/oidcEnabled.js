import gql from 'graphql-tag'

export const oidcEnabled = gql`
    query oidcEnabled($id: String!) {
        oidcEnabled(id: $id) {
            id
            isEnabled
            tenantOidcName
        }
    }
`

import { ApolloClient, ApolloLink } from '@apollo/client/core'
import { InMemoryCache } from '@apollo/client/cache'
import { createUploadLink } from 'apollo-upload-client'

import { getTenant } from '@/utils/getTenant'

export const apolloClient = new ApolloClient({
    link: ApolloLink.from([
        createUploadLink({
            uri: `${import.meta.env.VITE_API_URL}/graphql`,
            headers: { 'X-Tenant-Id': getTenant() },
            credentials: 'include',
        }),
    ]),
    cache: new InMemoryCache(),
})

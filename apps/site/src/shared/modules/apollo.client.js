import { ApolloClient } from '@apollo/client/core'
import { InMemoryCache } from '@apollo/client/cache'
import { getTenant } from '@/utils/getTenant'

const cache = new InMemoryCache()
export const apolloClient = new ApolloClient({
    cache,
    uri: `${import.meta.env.VITE_API_URL}/graphql`,
    credentials: 'include',
    headers: { 'X-Tenant-Id': getTenant() },
})

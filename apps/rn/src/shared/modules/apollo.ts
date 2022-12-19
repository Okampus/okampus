import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    ApolloLink,
    Operation,
    NextLink,
    ServerError,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { asyncMap } from '@apollo/client/utilities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { parse } from 'set-cookie-parser'
import { inspect } from 'util'

import { logout, logoutOnExpire } from '../utils/logout'

const httpLink = createHttpLink({
    uri: 'http://10.0.2.2:8081/graphql',
})

export interface AuthCookies {
    access_exp: {
        name: string
        value: string
        expires: string
        path: string
        domain: string
        httpOnly: boolean
        secure: boolean
        sameSite: string
    }
    refresh_exp: {
        name: string
        value: string
        expires: string
        path: string
        domain: string
        httpOnly: boolean
        secure: boolean
        sameSite: string
    }
    access_token: {
        name: string
        value: string
        expires: string
        path: string
        domain: string
        httpOnly: boolean
        secure: boolean
        sameSite: string
    }
    refresh_token: {
        name: string
        value: string
        expires: string
        path: string
        domain: string
        httpOnly: boolean
        secure: boolean
        sameSite: string
    }
}

let userToken: string | null = null
const withToken = setContext((req, { headers }) => {
    // if you have a cached value, return it immediately
    if (userToken)
        return {
            headers: {
                ...headers,
                ...(userToken ? { authorization: `Bearer ${userToken}` } : {}),
            },
        }

    const getAuthInfo = async () => {
        const token = await AsyncStorage.getItem('accessToken')
        const tenant = (await AsyncStorage.getItem('tenant')) ?? 'demo-tenant'
        return { token, tenant }
    }

    getAuthInfo().then(({ token, tenant }) => {
        userToken = token
        return {
            headers: {
                ...headers,
                ...(token ? { authorization: `Bearer ${token}` } : {}),
                'x-tenant-id': tenant,
            },
        }
    })
})

const resetToken = onError(({ networkError, graphQLErrors }) => {
    if (networkError && networkError.name === 'ServerError' && (networkError as ServerError).statusCode === 401) {
        userToken = null
        logout()
    } else {
        console.error('[Network error]', inspect(networkError))
        console.error('[GraphQLErrors]', inspect(graphQLErrors))
    }
})

const authReqLink = withToken.concat(resetToken)

const authResLink = new ApolloLink((operation: Operation, forward: NextLink) =>
    asyncMap(forward(operation), async (response) => {
        const context = operation.getContext()
        const cookies: string[] = context.response.headers.get('set-cookie')?.split(', ')

        if (cookies && !(await AsyncStorage.getItem('accessToken'))) {
            const parsedCookies = cookies
                .map((cookie) => parse(cookie)[0])
                .reduce((acc, value) => ({ ...acc, [value.name]: value }), {}) as AuthCookies

            await AsyncStorage.setItem('accessToken', parsedCookies.access_token.value)
            await AsyncStorage.setItem('refreshToken', parsedCookies.refresh_token.value)
        }

        return response
    }),
)

export const client = new ApolloClient({
    link: ApolloLink.from([authReqLink, authResLink, httpLink]),
    cache: new InMemoryCache(),
})

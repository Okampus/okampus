import { logout } from '../utils/logout';

import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { asyncMap } from '@apollo/client/utilities';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseSetCookieHeader } from '@okampus/shared/utils';

import type { Operation, NextLink } from '@apollo/client';

const httpLink = createHttpLink({ uri: 'http://10.0.2.2:8081/graphql' });

export interface AuthCookies {
  access_exp: {
    name: string;
    value: string;
    expires: string;
    path: string;
    domain: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: string;
  };
  refresh_exp: {
    name: string;
    value: string;
    expires: string;
    path: string;
    domain: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: string;
  };
  access_token: {
    name: string;
    value: string;
    expires: string;
    path: string;
    domain: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: string;
  };
  refresh_token: {
    name: string;
    value: string;
    expires: string;
    path: string;
    domain: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: string;
  };
}

let userToken: string | null = null;

const getAuthInfo = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const tenant = (await AsyncStorage.getItem('tenant')) ?? 'demo-tenant';
  return { token, tenant };
};

const withToken = setContext(async (req, { headers }) => {
  // if you have a cached value, return it immediately
  if (userToken)
    return {
      headers: {
        ...headers,
        ...(userToken ? { authorization: `Bearer ${userToken}` } : {}),
      },
    };

  return await getAuthInfo().then(({ token, tenant }) => {
    userToken = token;
    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        'x-tenant-id': tenant,
      },
    };
  });
});

const resetToken = onError(({ networkError, graphQLErrors }) => {
  if (networkError && 'statusCode' in networkError && networkError.statusCode === 401) {
    userToken = null;
    logout();
  } else {
    console.error('[Network error]', JSON.stringify(networkError));
    console.error('[GraphQLErrors]', JSON.stringify(graphQLErrors));
  }
});

// eslint-disable-next-line unicorn/prefer-spread
const authReqLink = withToken.concat(resetToken);

const authResLink = new ApolloLink((operation: Operation, forward: NextLink) =>
  asyncMap(forward(operation), async (response) => {
    const context = operation.getContext();
    const cookies: string[] = context.response.headers.get('set-cookie')?.split(', ');

    if (cookies && !(await AsyncStorage.getItem('accessToken'))) {
      const parsedCookies = parseSetCookieHeader(cookies);

      await AsyncStorage.setItem('accessToken', parsedCookies.access_token.value);
      await AsyncStorage.setItem('refreshToken', parsedCookies.refresh_token.value);
    }

    return response;
  })
);

export const client = new ApolloClient({
  link: ApolloLink.from([authReqLink, authResLink, httpLink]),
  cache: new InMemoryCache(),
});

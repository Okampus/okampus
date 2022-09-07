import { userFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const login = gql`
    mutation loginUser($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            ...UserInfo
            finishedIntroduction
            finishedOnboarding
        }
    }
    ${userFragment}
`

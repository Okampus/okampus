import { userFragment } from '@/graphql/fragments/userFragment'
import gql from 'graphql-tag'

export const getMe = gql`
    query getMe {
        me {
            ...UserInfo
            finishedOnboarding
        }
    }
    ${userFragment}
`

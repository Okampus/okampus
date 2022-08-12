import { contentFragment } from '@/graphql/fragments/contentFragment'
import { threadFragment } from '@/graphql/fragments/threadFragment'
import gql from 'graphql-tag'

export const getThreads = gql`
    query threads {
        threads {
            ...ThreadInfo
            post {
                ...ContentInfo
            }
        }
    }
    ${contentFragment}
    ${threadFragment}
`

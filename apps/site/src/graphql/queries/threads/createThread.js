import gql from 'graphql-tag'
import { contentFragment } from '@/graphql/fragments/contentFragment'
import { threadFragment } from '@/graphql/fragments/threadFragment'

export const createThread = gql`
    mutation createThread($thread: CreateThreadDto!) {
        createThread(thread: $thread) {
            ...ThreadInfo
            post {
                ...ContentInfo
            }
        }
    }
    ${threadFragment}
    ${contentFragment}
`

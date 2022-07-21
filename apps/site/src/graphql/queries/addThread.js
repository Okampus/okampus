import gql from 'graphql-tag'
import { contentFragment } from '@/graphql/fragments/contentFragment'
import { threadFragment } from '@/graphql/fragments/threadFragment'

export const addThread = gql`
    mutation addThread($thread: CreateThreadDto!) {
        addThread(thread: $thread) {
            ...ThreadInfo
            post {
                ...ContentInfo
            }
        }
    }
    ${threadFragment}
    ${contentFragment}
`

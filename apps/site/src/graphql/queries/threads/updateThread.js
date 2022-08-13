import { threadFragment } from '@/graphql/fragments/threadFragment'
import gql from 'graphql-tag'

// TODO: optimize this query
export const updateThread = gql`
    mutation updateThread($id: Int!, $thread: UpdateThreadDto!) {
        updateThread(id: $id, thread: $thread) {
            ...ThreadInfo
        }
    }
    ${threadFragment}
`

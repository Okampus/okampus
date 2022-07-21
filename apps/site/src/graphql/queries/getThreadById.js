import { contentFragment } from '@/graphql/fragments/contentFragment'
import { threadFragment } from '@/graphql/fragments/threadFragment'
import gql from 'graphql-tag'

export const getThreadById = gql`
    query thread($id: Int!) {
        threadById(id: $id) {
            ...ThreadInfo
            post {
                ...ContentInfo
                children {
                    ...ContentInfo
                    children {
                        ...ContentInfo
                    }
                }
            }
        }
    }
    ${contentFragment}
    ${threadFragment}
`

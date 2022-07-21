import gql from 'graphql-tag'
import { contentFragment } from '@/graphql/fragments/contentFragment'

export const vote = gql`
    mutation vote($id: Int!, $value: Int!) {
        voteContent(id: $id, value: $value) {
            ...ContentInfo
        }
    }
    ${contentFragment}
`

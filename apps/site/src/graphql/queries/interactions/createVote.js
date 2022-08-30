import gql from 'graphql-tag'
import { contentFragment } from '@/graphql/fragments/contentFragment'

export const vote = gql`
    mutation createVote($id: Int!, $value: Int!) {
        createVote(id: $id, value: $value) {
            ...ContentInfo
        }
    }
    ${contentFragment}
`

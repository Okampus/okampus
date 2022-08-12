import { contentFragment } from '@/graphql/fragments/contentFragment'
import gql from 'graphql-tag'

// TODO: optimize this query
export const editContent = gql`
    mutation editContent($id: Int!, $content: UpdateContentDto!) {
        updateContent(id: $id, content: $content) {
            ...ContentInfo
            children {
                ...ContentInfo
                children {
                    ...ContentInfo
                }
            }
        }
    }
    ${contentFragment}
`

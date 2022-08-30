import { contentFragment } from '@/graphql/fragments/contentFragment'
import gql from 'graphql-tag'

export const createContent = gql`
    mutation createContent($child: CreateContentWithKindDto!) {
        createContent(child: $child) {
            ...ContentInfo
            children {
                ...ContentInfo
            }
        }
    }
    ${contentFragment}
`

import { contentFragment } from '../fragments/contentFragment'
import gql from 'graphql-tag'

export const addContent = gql`
    mutation addContent($child: CreateContentWithKindDto!) {
        addContent(child: $child) {
            ...ContentInfo
            children {
                ...ContentInfo
            }
        }
    }
    ${contentFragment}
`
